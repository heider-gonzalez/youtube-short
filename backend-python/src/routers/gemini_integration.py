from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

class GeminiRequest(BaseModel):
    prompt: str
    context: Optional[Dict] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000

class AnalysisRequest(BaseModel):
    channel_id: str
    data: Dict
    analysis_type: str

@router.post("/generate")
async def generate_content(request: GeminiRequest):
    """
    Genera contenido usando Gemini AI
    """
    try:
        response = await gemini_service.generate(
            prompt=request.prompt,
            context=request.context,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-channel")
async def analyze_channel(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Analiza datos del canal usando Gemini
    """
    try:
        analysis = await gemini_service.analyze_channel_data(
            channel_id=request.channel_id,
            data=request.data,
            analysis_type=request.analysis_type
        )
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-content")
async def optimize_content(request: GeminiRequest):
    """
    Optimiza contenido existente usando Gemini
    """
    try:
        optimized = await gemini_service.optimize_content(
            content=request.prompt,
            context=request.context
        )
        return {"optimized_content": optimized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/spam-check")
async def spam_check(content: str):
    """
    Verifica si el contenido potencialmente viola normas de YouTube
    """
    try:
        check_result = await gemini_service.check_spam_compliance(content)
        return {"spam_check": check_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-thumbnails")
async def generate_thumbnails(request: GeminiRequest):
    """
    Genera ideas para thumbnails usando Gemini
    """
    try:
        thumbnail_ideas = await gemini_service.generate_thumbnail_ideas(
            video_topic=request.prompt,
            context=request.context
        )
        return {"thumbnail_ideas": thumbnail_ideas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
