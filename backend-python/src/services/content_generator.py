import google.generativeai as genai
import openai
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class ContentGenerator:
    def __init__(self):
        # Configurar Gemini
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        
        # Configurar OpenAI
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
    
    async def generate_script(
        self,
        niche: str,
        topic: Optional[str],
        style: str,
        language: str,
        target_audience: Optional[str]
    ) -> str:
        """
        Genera script optimizado para YouTube Shorts usando Gemini
        """
        prompt = f"""
        Genera un script para un YouTube Short de 60 segundos.
        
        Nicho: {niche}
        Tema: {topic if topic else 'automático basado en tendencias'}
        Estilo: {style}
        Idioma: {language}
        Audiencia objetivo: {target_audience if target_audience 'general'}
        
        Requisitos:
        - Máximo 150 palabras (aprox. 60 segundos)
        - Gancho irresistible en los primeros 3 segundos
        - Llamada a la acción clara al final
        - Optimizado para retención y viralidad
        - Evitar contenido spam y cumplir normas de YouTube
        - Tono atractivo y dinámico
        
        Formato de respuesta:
        SOLO el script, sin explicaciones adicionales.
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generando script con Gemini: {e}")
            # Fallback a OpenAI
            return await self._generate_script_openai(
                niche, topic, style, language, target_audience
            )
    
    async def _generate_script_openai(
        self,
        niche: str,
        topic: Optional[str],
        style: str,
        language: str,
        target_audience: Optional[str]
    ) -> str:
        """Fallback usando OpenAI"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en crear contenido viral para YouTube Shorts"
                    },
                    {
                        "role": "user",
                        "content": f"Genera un script de 60 segundos para YouTube Short. Nicho: {niche}, Tema: {topic}, Estilo: {style}, Idioma: {language}"
                    }
                ],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Error generando script: {e}")
    
    async def generate_visual_prompts(
        self,
        script: str,
        style: str
    ) -> List[str]:
        """
        Genera prompts para crear imágenes con IA (DALL-E/Midjourney)
        """
        prompt = f"""
        Basado en este script para YouTube Short:
        "{script}"
        
        Genera 5-8 prompts descriptivos para crear imágenes con IA que acompañen el video.
        Estilo visual: {style}
        
        Cada prompt debe:
        - Ser descriptivo y específico
        - Incluir estilo, mood, colores
        - Ser apropiado para el formato vertical (9:16)
        - Evitar contenido ofensivo o protegido por copyright
        
        Formato: Un prompt por línea, sin numeración.
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            prompts = [line.strip() for line in response.text.split('\n') if line.strip()]
            return prompts[:8]  # Máximo 8 prompts
        except Exception as e:
            print(f"Error generando prompts visuales: {e}")
            return []
    
    async def generate_audio_config(
        self,
        script: str,
        language: str
    ) -> dict:
        """
        Genera configuración para narración con ElevenLabs
        """
        word_count = len(script.split())
        estimated_duration = word_count * 0.4  # ~0.4 segundos por palabra
        
        return {
            "voice": "eleven_multilingual_v2" if language != "en" else "eleven_monolingual_v1",
            "language": language,
            "speed": 1.0,
            "stability": 0.5,
            "similarity_boost": 0.75,
            "estimated_duration": estimated_duration,
            "text": script
        }
    
    async def generate_metadata(
        self,
        niche: str,
        script: str,
        language: str
    ) -> dict:
        """
        Genera metadatos optimizados para SEO y descubrimiento
        """
        prompt = f"""
        Basado en este script para YouTube Short:
        "{script}"
        
        Genera:
        1. Título viral (máximo 60 caracteres)
        2. Descripción breve (máximo 100 caracteres)
        3. 5-10 tags relevantes
        4. Categoría de YouTube
        
        Nicho: {niche}
        Idioma: {language}
        
        Responde en formato JSON con claves: title, description, tags, category
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            # Parsear respuesta JSON (implementar parsing robusto)
            return {
                "title": "Título generado por IA",
                "description": "Descripción generada por IA",
                "tags": ["tag1", "tag2", "tag3"],
                "category": "Entertainment"
            }
        except Exception as e:
            print(f"Error generando metadatos: {e}")
            return {}
    
    async def get_trending_topics(
        self,
        niche: str,
        language: str
    ) -> List[str]:
        """
        Obtiene temas trending usando análisis de datos y Gemini
        """
        prompt = f"""
        Genera 10 temas trending actuales para el nicho: {niche}
        Idioma: {language}
        
        Los temas deben:
        - Ser relevantes y actuales
        - Tener potencial viral
        - Cumplir con normas de YouTube
        - Evitar controversias excesivas
        
        Responde con un tema por línea, sin numeración.
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            topics = [line.strip() for line in response.text.split('\n') if line.strip()]
            return topics[:10]
        except Exception as e:
            print(f"Error obteniendo trending topics: {e}")
            return []
