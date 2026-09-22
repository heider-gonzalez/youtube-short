from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import os
from services.content_generator import ContentGenerator
from services.video_creator import VideoCreator

router = APIRouter()
content_generator = ContentGenerator()
video_creator = VideoCreator()

class ContentRequest(BaseModel):
    niche: str
    topic: Optional[str] = None
    style: str = "viral"
    language: str = "es"
    duration: int = 60  # segundos
    target_audience: Optional[str] = None

class GeneratedContent(BaseModel):
    script: str
    visual_prompts: List[str]
    audio_config: dict
    metadata: dict

@router.post("/generate", response_model=GeneratedContent)
async def generate_content(request: ContentRequest):
    """
    Genera contenido completo para un video Short usando IA
    """
    try:
        # Generar script con Gemini
        script = await content_generator.generate_script(
            niche=request.niche,
            topic=request.topic,
            style=request.style,
            language=request.language,
            target_audience=request.target_audience
        )
        
        # Generar prompts visuales
        visual_prompts = await content_generator.generate_visual_prompts(
            script=script,
            style=request.style
        )
        
        # Configurar audio
        audio_config = await content_generator.generate_audio_config(
            script=script,
            language=request.language
        )
        
        # Metadatos para optimización
        metadata = await content_generator.generate_metadata(
            niche=request.niche,
            script=script,
            language=request.language
        )
        
        return GeneratedContent(
            script=script,
            visual_prompts=visual_prompts,
            audio_config=audio_config,
            metadata=metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-video")
async def create_video(
    script: str,
    visual_prompts: List[str],
    audio_config: dict,
    background_tasks: BackgroundTasks
):
    """
    Crea el video final combinando script, visuales y audio
    """
    try:
        video_path = await video_creator.create_video(
            script=script,
            visual_prompts=visual_prompts,
            audio_config=audio_config
        )
        
        return {
            "status": "success",
            "video_path": video_path,
            "message": "Video creado exitosamente"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending-topics/{niche}")
async def get_trending_topics(niche: str, language: str = "es"):
    """
    Obtiene temas trending para un nicho específico
    """
    try:
        topics = await content_generator.get_trending_topics(
            niche=niche,
            language=language
        )
        return {"topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
