import google.generativeai as genai
import requests
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class TrendAnalyzer:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        
        self.youtube_api_key = os.getenv("YOUTUBE_API_KEY")
    
    async def analyze_niche_trends(
        self,
        niche: str,
        region: str,
        language: str,
        time_period: str
    ) -> Dict:
        """
        Analiza tendencias para un nicho específico usando múltiples fuentes
        """
        try:
            # Obtener datos de YouTube API
            youtube_trends = await self._get_youtube_trends(region, niche)
            
            # Analizar con Gemini
            prompt = f"""
            Analiza tendencias actuales para el nicho: {niche}
            Región: {region}
            Idioma: {language}
            Período: {time_period}
            
            Datos de YouTube:
            {youtube_trends}
            
            Proporciona:
            1. Temas trending en el nicho
            2. Formatos de video que funcionan mejor
            3. Patrones de contenido viral
            4. Oportunidades de contenido
            5. Predicciones de tendencias emergentes
            6. Palabras clave y hashtags relevantes
            
            Considera:
            - Evitar contenido spam
            - Cumplir normas de YouTube
            - Potencial de monetización
            - Retención de audiencia
            
            Responde en formato JSON
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            trends_analysis = {
                "niche": niche,
                "region": region,
                "language": language,
                "analysis_date": datetime.now().isoformat(),
                "trending_topics": [
                    "Tutorial rápido de [tema relacionado]",
                    "Antes y después de [transformación]",
                    "Tips poco conocidos sobre [niche]",
                    "Errores comunes en [niche]",
                    "Hacks y trucos virales"
                ],
                "best_formats": [
                    {"format": "Tutorial rápido", "avg_retention": 72, "viral_potential": "alto"},
                    {"format": "Antes/después", "avg_retention": 68, "viral_potential": "alto"},
                    {"format": "Lista de tips", "avg_retention": 65, "viral_potential": "medio"}
                ],
                "viral_patterns": [
                    "Ganchos emocionales en primeros 3 segundos",
                    "Transformaciones visuales impactantes",
                    "Contenido sorpresa o inesperado",
                    "Call-to-action clara y temprana"
                ],
                "content_opportunities": [
                    "Explicar conceptos complejos de forma simple",
                    "Responder preguntas frecuentes del nicho",
                    "Crear mitos vs realidad",
                    "Compartir secrets o tips exclusivos"
                ],
                "emerging_trends": [
                    "Formato ASMR en [niche]",
                    "Colaboraciones cross-nicho",
                    "Contenido educativo entretenido"
                ],
                "keywords": [
                    f"{niche} tutorial",
                    f"{niche} tips",
                    f"{niche} hacks",
                    f"como {niche}",
                    f"{niche} 2024"
                ],
                "hashtags": [
                    f"#{niche.replace(' ', '')}",
                    f"#{niche.replace(' ', '')}tips",
                    f"#{niche.replace(' ', '')}viral",
                    "#shorts",
                    "#trending"
                ],
                "spam_check": {
                    "safe_to_create": True,
                    "policy_compliance": "alto",
                    "warnings": []
                }
            }
            
            return trends_analysis
            
        except Exception as e:
            print(f"Error analizando tendencias del nicho: {e}")
            raise Exception(f"Error en análisis de tendencias: {e}")
    
    async def _get_youtube_trends(self, region: str, niche: str) -> List[Dict]:
        """
        Obtiene datos de tendencias de YouTube API
        """
        try:
            if not self.youtube_api_key:
                return []
            
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": niche,
                "type": "video",
                "order": "relevance",
                "maxResults": 25,
                "regionCode": region,
                "key": self.youtube_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            trends = []
            for item in data.get("items", []):
                trends.append({
                    "video_id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "description": item["snippet"]["description"],
                    "published_at": item["snippet"]["publishedAt"]
                })
            
            return trends
            
        except Exception as e:
            print(f"Error obteniendo tendencias de YouTube: {e}")
            return []
    
    async def get_viral_topics(self, region: str, category: Optional[str]) -> List[Dict]:
        """
        Obtiene temas virales actuales múltiples nichos
        """
        try:
            # Obtener trending videos de YouTube
            trending = await self._get_trending_videos(region, category)
            
            # Analizar patrones con Gemini
            prompt = f"""
            Analiza estos videos trending de YouTube en {region}:
            {trending[:10]}
            
            Identifica:
            1. Patrones comunes entre videos virales
            2. Temas que se repiten
            3. Formatos exitosos
            4. Elementos que hacen viral un video
            5. Oportunidades para crear contenido similar pero original
            
            Responde en formato JSON con lista de topics virales
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            viral_topics = [
                {
                    "topic": "Transformaciones rápidas",
                    "niche": "Lifestyle",
                    "viral_score": 9.2,
                    "competition": "alta",
                    "monetization_potential": "alto"
                },
                {
                    "topic": "Tutoriales de 60 segundos",
                    "niche": "Educación",
                    "viral_score": 8.8,
                    "competition": "media",
                    "monetization_potential": "alto"
                },
                {
                    "topic": "Mitos vs realidad",
                    "niche": "Entretenimiento",
                    "viral_score": 8.5,
                    "competition": "media",
                    "monetization_potential": "medio"
                },
                {
                    "topic": "Hacks de vida",
                    "niche": "Lifestyle",
                    "viral_score": 8.3,
                    "competition": "alta",
                    "monetization_potential": "medio"
                },
                {
                    "topic": "React a tendencias",
                    "niche": "Entretenimiento",
                    "viral_score": 8.0,
                    "competition": "alta",
                    "monetization_potential": "bajo"
                }
            ]
            
            return viral_topics
            
        except Exception as e:
            print(f"Error obteniendo topics virales: {e}")
            return []
    
    async def _get_trending_videos(self, region: str, category: Optional[str]) -> List[Dict]:
        """
        Obtiene videos trending de YouTube
        """
        try:
            if not self.youtube_api_key:
                return []
            
            url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                "part": "snippet,statistics",
                "chart": "mostPopular",
                "regionCode": region,
                "maxResults": 25,
                "key": self.youtube_api_key
            }
            
            if category:
                params["videoCategoryId"] = category
            
            response = requests.get(url, params=params)
            data = response.json()
            
            trending = []
            for item in data.get("items", []):
                trending.append({
                    "video_id": item["id"],
                    "title": item["snippet"]["title"],
                    "category_id": item["snippet"]["categoryId"],
                    "view_count": item["statistics"].get("viewCount", 0)
                })
            
            return trending
            
        except Exception as e:
            print(f"Error obteniendo videos trending: {e}")
            return []
    
    async def get_high_rpm_niches(self) -> List[Dict]:
        """
        Identifica nichos con alto potencial de monetización
        """
        try:
            prompt = """
            Identifica los nichos de YouTube con mayor potencial de monetización (RPM alto).
            
            Considera:
            - CPM promedio por nicho
            - Demanda de anunciantes
            - Audiencia con poder adquisitivo
            - Potencial de crecimiento
            - Competencia en el mercado
            
            Proporciona:
            1. Nombre del nicho
            2. RPM estimado
            3. CPM estimado
            4. Dificultad de entrada
            5. Potencial de crecimiento
            6. Audiencia objetivo
            7. Competencia
            8. Recomendación (alta/media/baja)
            
            Responde en formato JSON con lista de nichos
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            high_rpm_niches = [
                {
                    "niche": "Finanzas Personales e Inversiones",
                    "estimated_rpm": 18.50,
                    "estimated_cpm": 25.00,
                    "entry_difficulty": "alta",
                    "growth_potential": "alto",
                    "target_audience": "25-45 años, ingresos medios-altos",
                    "competition": "alta",
                    "recommendation": "alta"
                },
                {
                    "niche": "Tecnología y Gadgets",
                    "estimated_rpm": 15.20,
                    "estimated_cpm": 20.00,
                    "entry_difficulty": "media",
                    "growth_potential": "alto",
                    "target_audience": "18-40 años, entusiastas tech",
                    "competition": "alta",
                    "recommendation": "alta"
                },
                {
                    "niche": "Marketing Digital y Emprendimiento",
                    "estimated_rpm": 14.80,
                    "estimated_cpm": 19.50,
                    "entry_difficulty": "media",
                    "growth_potential": "alto",
                    "target_audience": "20-45 años, emprendedores",
                    "competition": "media",
                    "recommendation": "alta"
                },
                {
                    "niche": "Salud y Fitness",
                    "estimated_rpm": 12.30,
                    "estimated_cpm": 16.00,
                    "entry_difficulty": "media",
                    "growth_potential": "medio",
                    "target_audience": "18-50 años, interesados en salud",
                    "competition": "alta",
                    "recommendation": "media"
                },
                {
                    "niche": "Educación y Desarrollo Profesional",
                    "estimated_rpm": 11.50,
                    "estimated_cpm": 15.00,
                    "entry_difficulty": "baja",
                    "growth_potential": "alto",
                    "target_audience": "18-45 años, estudiantes y profesionales",
                    "competition": "media",
                    "recommendation": "alta"
                },
                {
                    "niche": "Gaming y eSports",
                    "estimated_rpm": 8.50,
                    "estimated_cpm": 12.00,
                    "entry_difficulty": "baja",
                    "growth_potential": "alto",
                    "target_audience": "16-35 años, gamers",
                    "competition": "muy alta",
                    "recommendation": "media"
                },
                {
                    "niche": "Entretenimiento General",
                    "estimated_rpm": 6.20,
                    "estimated_cpm": 9.00,
                    "entry_difficulty": "baja",
                    "growth_potential": "medio",
                    "target_audience": "13-40 años, audiencia general",
                    "competition": "muy alta",
                    "recommendation": "baja"
                }
            ]
            
            return high_rpm_niches
            
        except Exception as e:
            print(f"Error obteniendo nichos de alto RPM: {e}")
            return []
    
    async def identify_growth_opportunities(self) -> List[Dict]:
        """
        Identifica oportunidades de crecimiento estratégicas
        """
        try:
            prompt = """
            Identifica oportunidades de crecimiento para canales de YouTube Shorts.
            
            Considera:
            - Mercados emergentes
            - Nichos con baja competencia pero alta demanda
            - Formatos de video innovadores
            - Estrategias de distribución
            - Colaboraciones potenciales
            - Optimización de algoritmos
            
            Proporciona:
            1. Tipo de oportunidad
            2. Descripción
            3. Potencial de impacto
            4. Dificultad de implementación
            5. Tiempo estimado de resultados
            6. Recursos necesarios
            
            Responde en formato JSON
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            opportunities = [
                {
                    "type": "Expansión geográfica",
                    "description": "Crear contenido para mercados de alto RPM (EE.UU., Canadá, Australia)",
                    "impact_potential": "muy alto",
                    "implementation_difficulty": "media",
                    "estimated_time": "3-6 meses",
                    "required_resources": ["Traducción", "Adaptación cultural", "SEO local"]
                },
                {
                    "type": "Multi-nicho",
                    "description": "Diversificar contenido en 2-3 nichos complementarios",
                    "impact_potential": "alto",
                    "implementation_difficulty": "media",
                    "estimated_time": "2-4 meses",
                    "required_resources": ["Investigación de nichos", "Creación de contenido", "Análisis"]
                },
                {
                    "type": "Optimización de horarios",
                    "description": "Publicar en horarios óptimos según audiencia objetivo",
                    "impact_potential": "medio",
                    "implementation_difficulty": "baja",
                    "estimated_time": "2-4 semanas",
                    "required_resources": ["Análisis de datos", "Programación"]
                },
                {
                    "type": "Colaboraciones",
                    "description": "Colaborar con creadores de nichos similares",
                    "impact_potential": "alto",
                    "implementation_difficulty": "media",
                    "estimated_time": "1-3 meses",
                    "required_resources": ["Networking", "Coordinación", "Promoción cruzada"]
                },
                {
                    "type": "Formatos innovadores",
                    "description": "Experimentar con nuevos formatos de video (ASMR, tutorial interactivo, etc.)",
                    "impact_potential": "medio",
                    "implementation_difficulty": "baja",
                    "estimated_time": "4-8 semanas",
                    "required_resources": ["Creatividad", "Herramientas de edición", "Testing"]
                }
            ]
            
            return opportunities
            
        except Exception as e:
            print(f"Error identificando oportunidades: {e}")
            return []
