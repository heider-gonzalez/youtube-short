from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from services.analytics_analyzer import AnalyticsAnalyzer

router = APIRouter()
analytics_analyzer = AnalyticsAnalyzer()

class AnalyticsRequest(BaseModel):
    channel_id: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    metrics: List[str] = ["views", "watchTime", "subscribers", "retention"]

@router.post("/analyze")
async def analyze_analytics(request: AnalyticsRequest):
    """
    Analiza analytics del canal usando Gemini AI
    """
    try:
        analysis = await analytics_analyzer.analyze_channel_performance(
            channel_id=request.channel_id,
            start_date=request.start_date,
            end_date=request.end_date,
            metrics=request.metrics
        )
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/{channel_id}")
async def get_recommendations(channel_id: str):
    """
    Obtiene recomendaciones de mejora basadas en analytics
    """
    try:
        recommendations = await analytics_analyzer.get_improvement_recommendations(channel_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rpm-analysis/{channel_id}")
async def analyze_rpm(channel_id: str):
    """
    Analiza RPM y sugiere optimizaciones de monetización
    """
    try:
        rpm_analysis = await analytics_analyzer.analyze_rpm(channel_id)
        return {"rpm_analysis": rpm_analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/retention-analysis/{video_id}")
async def analyze_retention(video_id: str):
    """
    Analiza retención de audiencia de un video específico
    """
    try:
        retention_analysis = await analytics_analyzer.analyze_video_retention(video_id)
        return {"retention_analysis": retention_analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
