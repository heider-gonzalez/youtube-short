import google.generativeai as genai
import pandas as pd
import numpy as np
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class AnalyticsAnalyzer:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
    
    async def analyze_channel_performance(
        self,
        channel_id: str,
        start_date: Optional[str],
        end_date: Optional[str],
        metrics: List[str]
    ) -> Dict:
        """
        Analiza el rendimiento del canal usando Gemini AI
        """
        try:
            # Aquí se obtendrían los datos reales de YouTube Analytics API
            # Por ahora, simulamos datos para el ejemplo
            
            analytics_data = await self._get_analytics_data(channel_id, start_date, end_date)
            
            # Crear prompt para Gemini
            prompt = f"""
            Analiza estos datos de analytics de un canal de YouTube:
            
            Canal ID: {channel_id}
            Período: {start_date or 'últimos 30 días'} a {end_date or 'hoy'}
            
            Datos:
            - Vistas totales: {analytics_data.get('total_views', 0):,}
            - Tiempo de visualización: {analytics_data.get('watch_time_hours', 0):.1f} horas
            - Suscriptores ganados: {analytics_data.get('subscribers_gained', 0):,}
            - Suscriptores perdidos: {analytics_data.get('subscribers_lost', 0):,}
            - Retención promedio: {analytics_data.get('avg_retention', 0):.1f}%
            - CTR promedio: {analytics_data.get('avg_ctr', 0):.1f}%
            
            Proporciona un análisis detallado que incluya:
            1. Evaluación general del rendimiento
            2. Fortalezas del canal
            3. Áreas de mejora
            4. Tendencias identificadas
            5. Recomendaciones específicas para mejorar
            
            Responde en formato JSON con claves: evaluation, strengths, weaknesses, trends, recommendations
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            # Parsear respuesta (implementar parsing robusto)
            analysis = {
                "evaluation": "El canal muestra un crecimiento saludable con buena retención",
                "strengths": [
                    "Alta retención de audiencia",
                    "Buen crecimiento de suscriptores",
                    "Contenido consistente"
                ],
                "weaknesses": [
                    "CTR podría mejorar",
                    "Oportunidad de expandir horarios de publicación"
                ],
                "trends": [
                    "Mayor actividad en horarios nocturnos",
                    "Contenido de ciertos nichos funciona mejor"
                ],
                "recommendations": [
                    "Optimizar miniaturas para mejorar CTR",
                    "Experimentar con horarios de publicación",
                    "Crear más contenido en nichos de alto rendimiento"
                ]
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analizando rendimiento del canal: {e}")
            raise Exception(f"Error en análisis: {e}")
    
    async def _get_analytics_data(
        self,
        channel_id: str,
        start_date: Optional[str],
        end_date: Optional[str]
    ) -> Dict:
        """
        Obtiene datos de analytics (simulado - conectar con YouTube Analytics API)
        """
        # En producción, esto llamaría a la API de YouTube Analytics
        # Por ahora retornamos datos simulados
        
        return {
            "total_views": 150000,
            "watch_time_hours": 2500,
            "subscribers_gained": 1200,
            "subscribers_lost": 150,
            "avg_retention": 65.5,
            "avg_ctr": 4.2,
            "top_performing_videos": [
                {"video_id": "vid1", "views": 50000, "retention": 75},
                {"video_id": "vid2", "views": 35000, "retention": 68}
            ]
        }
    
    async def get_improvement_recommendations(self, channel_id: str) -> List[Dict]:
        """
        Obtiene recomendaciones de mejora basadas en análisis profundo
        """
        try:
            analytics_data = await self._get_analytics_data(channel_id, None, None)
            
            prompt = f"""
            Basado en estos datos del canal:
            - Retención promedio: {analytics_data.get('avg_retention', 0)}%
            - CTR promedio: {analytics_data.get('avg_ctr', 0)}%
            - Suscriptores netos: {analytics_data.get('subscribers_gained', 0) - analytics_data.get('subscribers_lost', 0)}
            
            Genera 5-7 recomendaciones específicas y accionables para:
            1. Mejorar retención de audiencia
            2. Aumentar CTR
            3. Optimizar monetización
            4. Crear contenido más viral
            
            Cada recomendación debe incluir:
            - Descripción clara
            - Prioridad (alta/media/baja)
            - Impacto esperado
            - Dificultad de implementación
            
            Responde en formato JSON
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            recommendations = [
                {
                    "category": "Retención",
                    "description": "Incluir ganchos más fuertes en los primeros 3 segundos",
                    "priority": "alta",
                    "expected_impact": "+15% retención",
                    "difficulty": "media"
                },
                {
                    "category": "CTR",
                    "description": "Optimizar miniaturas con colores contrastantes y texto claro",
                    "priority": "alta",
                    "expected_impact": "+20% CTR",
                    "difficulty": "baja"
                },
                {
                    "category": "Monetización",
                    "description": "Aumentar duración a 58-59 segundos para maximizar anuncios",
                    "priority": "media",
                    "expected_impact": "+10% RPM",
                    "difficulty": "baja"
                }
            ]
            
            return recommendations
            
        except Exception as e:
            print(f"Error obteniendo recomendaciones: {e}")
            return []
    
    async def analyze_rpm(self, channel_id: str) -> Dict:
        """
        Analiza RPM y sugiere optimizaciones de monetización
        """
        try:
            # Obtener datos de monetización
            monetization_data = await self._get_monetization_data(channel_id)
            
            prompt = f"""
            Analiza estos datos de monetización:
            - RPM actual: ${monetization_data.get('rpm', 0):.2f}
            - CPM: ${monetization_data.get('cpm', 0):.2f}
            - Principales países de audiencia: {monetization_data.get('top_countries', [])}
            - Categorías de anuncios: {monetization_data.get('ad_categories', [])}
            
            Proporciona:
            1. Análisis del RPM actual vs promedio del nicho
            2. Oportunidades para aumentar RPM
            3. Estrategias de contenido para audiencias de alto valor
            4. Recomendaciones de keywords y temas
            
            Responde en formato JSON
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            rpm_analysis = {
                "current_rpm": monetization_data.get('rpm', 0),
                "industry_average": 8.50,
                "rpm_score": "por_encima_del_promedio" if monetization_data.get('rpm', 0) > 8.50 else "por_debajo_del_promedio",
                "optimization_opportunities": [
                    "Crear contenido para audiencia en EE.UU. (RPM $15.50)",
                    "Incluir keywords de alto valor CPC",
                    "Optimizar para audiencias de 25-34 años",
                    "Crear contenido en nichos de tecnología/finanzas"
                ],
                "recommended_topics": [
                    "Tutoriales de tecnología",
                    "Reseñas de productos",
                    "Contenido educativo",
                    "Tendencias de alta demanda"
                ]
            }
            
            return rpm_analysis
            
        except Exception as e:
            print(f"Error analizando RPM: {e}")
            return {}
    
    async def _get_monetization_data(self, channel_id: str) -> Dict:
        """
        Obtiene datos de monetización (simulado)
        """
        return {
            "rpm": 12.50,
            "cpm": 18.00,
            "top_countries": ["US", "ES", "MX", "AR"],
            "ad_categories": ["Technology", "Entertainment", "Education"],
            "audience_demographics": {
                "age_18_24": 0.25,
                "age_25_34": 0.40,
                "age_35_44": 0.20,
                "age_45_plus": 0.15
            }
        }
    
    async def analyze_video_retention(self, video_id: str) -> Dict:
        """
        Analiza la retención de audiencia de un video específico
        """
        try:
            # Obtener datos de retención del video
            retention_data = await self._get_video_retention_data(video_id)
            
            prompt = f"""
            Analiza estos datos de retención del video {video_id}:
            - Retención promedio: {retention_data.get('avg_retention', 0)}%
            - Punto de mayor caída: {retention_data.get('drop_off_point', 0)} segundos
            - Retención al final: {retention_data.get('final_retention', 0)}%
            - Curva de retención: {retention_data.get('retention_curve', [])}
            
            Identifica:
            1. Por qué la audiencia se va en ciertos puntos
            2. Qué funciona bien en el video
            3. Cómo mejorar la retención en futuros videos
            4. Puntos específicos del video a optimizar
            
            Responde en formato JSON
            """
            
            response = self.gemini_model.generate_content(prompt)
            
            retention_analysis = {
                "video_id": video_id,
                "avg_retention": retention_data.get('avg_retention', 0),
                "performance_rating": "excelente" if retention_data.get('avg_retention', 0) > 70 else "buena" if retention_data.get('avg_retention', 0) > 50 else "necesita_mejora",
                "drop_off_analysis": {
                    "critical_points": [
                        {"time": "0-3s", "issue": "Gancho débil", "suggestion": "Mejorar el inicio"},
                        {"time": "15-20s", "issue": "Pérdida de interés", "suggestion": "Añadir elemento visual"}
                    ],
                    "strong_points": [
                        {"time": "30-45s", "reason": "Contenido interesante"},
                        {"time": "50-60s", "reason": "Llamada a la acción efectiva"}
                    ]
                },
                "improvement_suggestions": [
                    "Fortalecer el gancho inicial",
                    "Mantener ritmo dinámico",
                    "Añadir transiciones suaves",
                    "Optimizar duración a 58-59 segundos"
                ]
            }
            
            return retention_analysis
            
        except Exception as e:
            print(f"Error analizando retención de video: {e}")
            return {}
    
    async def _get_video_retention_data(self, video_id: str) -> Dict:
        """
        Obtiene datos de retención de video (simulado)
        """
        return {
            "avg_retention": 68.5,
            "drop_off_point": 18,
            "final_retention": 45.0,
            "retention_curve": [100, 85, 70, 65, 60, 58, 55, 52, 50, 48, 45]
        }
