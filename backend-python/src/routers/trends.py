from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.trend_analyzer import TrendAnalyzer

router = APIRouter()
trend_analyzer = TrendAnalyzer()

class TrendRequest(BaseModel):
    niche: str
    region: str = "US"
    language: str = "en"
    time_period: str = "7d"

@router.post("/analyze")
async def analyze_trends(request: TrendRequest):
    """
    Analiza tendencias para un nicho específico
    """
    try:
        trends = await trend_analyzer.analyze_niche_trends(
            niche=request.niche,
            region=request.region,
            language=request.language,
            time_period=request.time_period
        )
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/viral-topics")
async def get_viral_topics(region: str = "US", category: Optional[str] = None):
    """
    Obtiene temas virales actuales
    """
    try:
        viral_topics = await trend_analyzer.get_viral_topics(region, category)
        return {"viral_topics": viral_topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/high-rpm-niches")
async def get_high_rpm_niches():
    """
    Obtiene nichos con alto potencial de monetización
    """
    try:
        niches = await trend_analyzer.get_high_rpm_niches()
        return {"niches": niches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/growth-opportunities")
async def get_growth_opportunities():
    """
    Identifica oportunidades de crecimiento
    """
    try:
        opportunities = await trend_analyzer.identify_growth_opportunities()
        return {"opportunities": opportunities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
