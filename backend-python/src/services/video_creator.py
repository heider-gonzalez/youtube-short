import os
import asyncio
from typing import List
from moviepy.editor import *
from PIL import Image
import requests
from dotenv import load_dotenv
import openai
from elevenlabs import generate, Voice, VoiceSettings

load_dotenv()

class VideoCreator:
    def __init__(self):
        self.output_dir = os.getenv("VIDEO_OUTPUT_DIR", "./videos")
        self.temp_dir = os.getenv("TEMP_DIR", "./temp")
        
        # Crear directorios si no existen
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Configurar APIs
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
        
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    
    async def create_video(
        self,
        script: str,
        visual_prompts: List[str],
        audio_config: dict
    ) -> str:
        """
        Crea el video final combinando imágenes generadas, audio y efectos
        """
        try:
            # 1. Generar imágenes con DALL-E
            image_paths = await self._generate_images(visual_prompts)
            
            # 2. Generar narración con ElevenLabs
            audio_path = await self._generate_audio(
                script,
                audio_config
            )
            
            # 3. Crear video con MoviePy
            video_path = await self._assemble_video(
                image_paths,
                audio_path,
                script
            )
            
            # 4. Limpiar archivos temporales
            await self._cleanup_temp_files(image_paths, audio_path)
            
            return video_path
            
        except Exception as e:
            raise Exception(f"Error creando video: {e}")
    
    async def _generate_images(self, prompts: List[str]) -> List[str]:
        """
        Genera imágenes usando DALL-E 3
        """
        image_paths = []
        
        for i, prompt in enumerate(prompts):
            try:
                response = openai.Image.create(
                    prompt=prompt,
                    n=1,
                    size="1024x1792",  # Formato vertical 9:16
                    model="dall-e-3"
                )
                
                image_url = response['data'][0]['url']
                image_path = os.path.join(self.temp_dir, f"image_{i}.png")
                
                # Descargar imagen
                img_response = requests.get(image_url)
                with open(image_path, 'wb') as f:
                    f.write(img_response.content)
                
                image_paths.append(image_path)
                
            except Exception as e:
                print(f"Error generando imagen {i}: {e}")
                # Usar imagen placeholder si falla
                image_paths.append(await self._create_placeholder_image(i))
        
        return image_paths
    
    async def _create_placeholder_image(self, index: int) -> str:
        """
        Crea una imagen placeholder cuando falla la generación
        """
        from PIL import Image, ImageDraw, ImageFont
        
        # Crear imagen vertical 1080x1920
        img = Image.new('RGB', (1080, 1920), color=(30, 30, 30))
        draw = ImageDraw.Draw(img)
        
        # Añadir texto
        text = f"Scene {index + 1}"
        draw.text((540, 960), text, fill=(255, 255, 255), anchor="mm")
        
        path = os.path.join(self.temp_dir, f"placeholder_{index}.png")
        img.save(path)
        return path
    
    async def _generate_audio(
        self,
        script: str,
        audio_config: dict
    ) -> str:
        """
        Genera narración usando ElevenLabs
        """
        try:
            audio_path = os.path.join(self.temp_dir, "narration.mp3")
            
            audio = generate(
                text=script,
                voice=audio_config.get("voice", "eleven_multilingual_v2"),
                model="eleven_multilingual_v2",
                api_key=self.elevenlabs_api_key
            )
            
            with open(audio_path, 'wb') as f:
                f.write(audio)
            
            return audio_path
            
        except Exception as e:
            print(f"Error generando audio: {e}")
            # Fallback: usar TTS del sistema
            return await self._generate_system_tts(script)
    
    async def _generate_system_tts(self, script: str) -> str:
        """
        Fallback usando TTS del sistema (gTTS o similar)
        """
        try:
            from gtts import gTTS
            audio_path = os.path.join(self.temp_dir, "narration_fallback.mp3")
            
            tts = gTTS(text=script, lang='es')
            tts.save(audio_path)
            
            return audio_path
        except Exception as e:
            print(f"Error con TTS fallback: {e}")
            raise Exception("No se pudo generar audio")
    
    async def _assemble_video(
        self,
        image_paths: List[str],
        audio_path: str,
        script: str
    ) -> str:
        """
        Ensambla el video final con MoviePy
        """
        try:
            # Cargar audio para obtener duración
            audio = AudioFileClip(audio_path)
            duration = audio.duration
            
            # Calcular duración por imagen
            img_duration = duration / len(image_paths)
            
            # Crear clips de imagen
            image_clips = []
            for img_path in image_paths:
                img = ImageClip(img_path)
                img = img.set_duration(img_duration)
                img = img.resize((1080, 1920))  # Formato vertical
                image_clips.append(img)
            
            # Concatenar imágenes
            video = concatenate_videoclips(image_clips)
            
            # Añadir audio
            video = video.set_audio(audio)
            
            # Añadir transiciones y efectos
            video = await self._add_effects(video, script)
            
            # Exportar video
            output_path = os.path.join(
                self.output_dir,
                f"short_{int(asyncio.get_event_loop().time())}.mp4"
            )
            
            video.write_videofile(
                output_path,
                fps=30,
                codec='libx264',
                audio_codec='aac',
                preset='medium'
            )
            
            # Cerrar clips
            audio.close()
            video.close()
            
            return output_path
            
        except Exception as e:
            raise Exception(f"Error ensamblando video: {e}")
    
    async def _add_effects(self, video, script: str):
        """
        Añade efectos visuales y transiciones
        """
        # Añadir zoom gradual
        video = video.resize(lambda t: 1 + 0.1 * t / video.duration)
        
        # Añadir subtítulos (implementar con text clip)
        # video = await self._add_subtitles(video, script)
        
        return video
    
    async def _cleanup_temp_files(self, image_paths: List[str], audio_path: str):
        """
        Limpia archivos temporales
        """
        try:
            for path in image_paths:
                if os.path.exists(path):
                    os.remove(path)
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except Exception as e:
            print(f"Error limpiando archivos temporales: {e}")
