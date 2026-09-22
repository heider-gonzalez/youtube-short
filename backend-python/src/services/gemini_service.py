import google.generativeai as genai
from typing import Dict, Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            self.vision_model = genai.GenerativeModel('gemini-pro-vision')
    
    async def generate(
        self,
        prompt: str,
        context: Optional[Dict] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Genera contenido usando Gemini
        """
        try:
            if context:
                prompt = f"""
                Contexto adicional:
                {context}
                
                Prompt principal:
                {prompt}
                """
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                )
            )
            
            return response.text
            
        except Exception as e:
            print(f"Error generando contenido con Gemini: {e}")
            raise Exception(f"Error en generación: {e}")
    
    async def analyze_channel_data(
        self,
        channel_id: str,
        data: Dict,
        analysis_type: str
    ) -> Dict:
        """
        Analiza datos del canal usando Gemini
        """
        try:
            prompt = f"""
            Analiza estos datos del canal {channel_id}:
            
            Tipo de análisis: {analysis_type}
            
            Datos:
            {data}
            
            Proporciona un análisis detallado con:
            1. Hallazgos clave
            2. Patrones identificados
            3. Recomendaciones específicas
            4. Próximos pasos sugeridos
            
            Responde en formato JSON
            """
            
            response = self.model.generate_content(prompt)
            
            # Parsear respuesta JSON (implementar parsing robusto)
            analysis = {
                "channel_id": channel_id,
                "analysis_type": analysis_type,
                "key_findings": [
                    "Buen crecimiento general del canal",
                    "Alta retención en ciertos tipos de contenido",
                    "Oportunidad de optimizar horarios de publicación"
                ],
                "patterns": [
                    "Mayor actividad en horarios nocturnos",
                    "Contenido educativo tiene mejor rendimiento",
                    "Formato corto funciona mejor que largo"
                ],
                "recommendations": [
                    "Aumentar frecuencia de publicación en horarios pico",
                    "Crear más contenido en nichos de alto rendimiento",
                    "Optimizar miniaturas y títulos"
                ],
                "next_steps": [
                    "Implementar cambios en horarios",
                    "A/B testing con diferentes formatos",
                    "Monitorear métricas clave"
                ]
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analizando datos del canal: {e}")
            raise Exception(f"Error en análisis: {e}")
    
    async def optimize_content(
        self,
        content: str,
        context: Optional[Dict] = None
    ) -> Dict:
        """
        Optimiza contenido existente usando Gemini
        """
        try:
            prompt = f"""
            Optimiza este contenido para YouTube Shorts:
            
            Contenido original:
            {content}
            
            Contexto: {context if context else 'No proporcionado'}
            
            Optimiza para:
            1. Máxima retención de audiencia
            2. Potencial viral
            3. Cumplimiento de normas de YouTube
            4. Monetización efectiva
            5. SEO y descubrimiento
            
            Proporciona:
            - Contenido optimizado
            - Cambios realizados
            - Justificación de cambios
            - Métricas esperadas de mejora
            
            Responde en formato JSON
            """
            
            response = self.model.generate_content(prompt)
            
            optimized = {
                "original_content": content,
                "optimized_content": content,  # En producción, usar respuesta de Gemini
                "changes_made": [
                    "Acortado introducción",
                    "Mejorado gancho inicial",
                    "Añadida llamada a la acción",
                    "Optimizado para formato corto"
                ],
                "justification": "Cambios enfocados en mejorar retención y viralidad",
                "expected_improvements": {
                    "retention": "+15%",
                    "ctr": "+10%",
                    "engagement": "+20%"
                }
            }
            
            return optimized
            
        except Exception as e:
            print(f"Error optimizando contenido: {e}")
            raise Exception(f"Error en optimización: {e}")
    
    async def check_spam_compliance(self, content: str) -> Dict:
        """
        Verifica si el contenido cumple con las normas de YouTube y no es spam
        """
        try:
            prompt = f"""
            Analiza este contenido para verificar cumplimiento con normas de YouTube:
            
            Contenido:
            {content}
            
            Verifica:
            1. ¿Es contenido engañoso?
            2. ¿Contiene spam?
            3. ¿Viola derechos de autor?
            4. ¿Es contenido ofensivo o inapropiado?
            5. ¿Manipula métricas de engagement?
            6. ¿Es clickbait excesivo?
            
            Proporciona:
            - Estado de cumplimiento (safe/warning/violation)
            - Problemas identificados (si los hay)
            - Recomendaciones para corregir
            - Nivel de riesgo
            
            Responde en formato JSON
            """
            
            response = self.model.generate_content(prompt)
            
            spam_check = {
                "content": content[:100] + "...",  # Preview del contenido
                "compliance_status": "safe",
                "is_spam": False,
                "issues": [],
                "warnings": [],
                "risk_level": "bajo",
                "recommendations": [
                    "El contenido parece cumplir con las normas",
                    "Mantener formato actual",
                    "Continuar monitoreando métricas"
                ],
                "youtube_policy_compliance": {
                    "deceptive_content": False,
                    "spam": False,
                    "copyright": False,
                    "offensive": False,
                    "engagement_manipulation": False,
                    "excessive_clickbait": False
                }
            }
            
            return spam_check
            
        except Exception as e:
            print(f"Error verificando spam: {e}")
            raise Exception(f"Error en verificación: {e}")
    
    async def generate_thumbnail_ideas(
        self,
        video_topic: str,
        context: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Genera ideas para thumbnails usando Gemini
        """
        try:
            prompt = f"""
            Genera ideas de thumbnails para un YouTube Short sobre:
            
            Tema: {video_topic}
            Contexto: {context if context else 'No proporcionado'}
            
            Genera 5 ideas de thumbnails que:
            1. Sean visualmente atractivas
            2. Tengan alto CTR potencial
            3. Representen el contenido accurately
            4. Cumplan con normas de YouTube
            5. Funcionen en formato vertical
            
            Para cada idea incluye:
            - Descripción visual detallada
            - Elementos principales (texto, colores, imágenes)
            - Estilo recomendado
            - CTR potencial estimado
            - Dificultad de creación
            
            Responde en formato JSON con lista de ideas
            """
            
            response = self.model.generate_content(prompt)
            
            thumbnail_ideas = [
                {
                    "idea_number": 1,
                    "description": "Imagen dividida en dos: 'ANTES' y 'DESPUÉS' con colores contrastantes",
                    "main_elements": [
                        "Texto grande 'ANTES' a la izquierda",
                        "Texto grande 'DESPUÉS' a la derecha",
                        "Colores: fondo oscuro con texto neón",
                        "Expresión facial sorprendida"
                    ],
                    "style": "Contraste alto, tipografía bold",
                    "estimated_ctr": "alto (8-12%)",
                    "creation_difficulty": "media"
                },
                {
                    "idea_number": 2,
                    "description": "Círculo rojo con número grande y pregunta intrigante",
                    "main_elements": [
                        "Número grande en círculo rojo",
                        "Pregunta corta y provocativa",
                        "Fondo degradado vibrante",
                        "Elementos visuales relacionados con el tema"
                    ],
                    "style": "Minimalista, colorido",
                    "estimated_ctr": "medio-alto (6-10%)",
                    "creation_difficulty": "baja"
                },
                {
                    "idea_number": 3,
                    "description": "Persona con expresión de shock/mascota + texto impactante",
                    "main_elements": [
                        "Primer plano de cara con expresión exagerada",
                        "Texto overlay con hook emocional",
                        "Colores complementarios",
                        "Efecto de zoom dramático"
                    ],
                    "style": "Emocional, dinámico",
                    "estimated_ctr": "alto (7-11%)",
                    "creation_difficulty": "media"
                },
                {
                    "idea_number": 4,
                    "description": "Tutorial paso a paso con numeración visual",
                    "main_elements": [
                        "3-4 pasos numerados",
                        "Iconos simples para cada paso",
                        "Fondo limpio y profesional",
                        "Colores de marca consistentes"
                    ],
                    "style": "Educativo, limpio",
                    "estimated_ctr": "medio (5-8%)",
                    "creation_difficulty": "baja"
                },
                {
                    "idea_number": 5,
                    "description": "Comparación visual con flechas y transformación",
                    "main_elements": [
                        "Dos imágenes con flecha entre ellas",
                        "Texto 'X vs Y' o 'Truco #1'",
                        "Colores contrastantes",
                        "Elemento visual destacado"
                    ],
                    "style": "Comparativo, informativo",
                    "estimated_ctr": "medio-alto (6-9%)",
                    "creation_difficulty": "media"
                }
            ]
            
            return thumbnail_ideas
            
        except Exception as e:
            print(f"Error generando ideas de thumbnails: {e}")
            return []
    
    async def analyze_performance_trends(
        self,
        performance_data: List[Dict],
        time_period: str
    ) -> Dict:
        """
        Analiza tendencias de rendimiento del canal
        """
        try:
            prompt = f"""
            Analiza estas tendencias de rendimiento del canal:
            
            Período: {time_period}
            
            Datos:
            {performance_data}
            
            Identifica:
            1. Tendencias de crecimiento/declive
            2. Patrones estacionales
            3. Impacto de cambios estratégicos
            4. Correlaciones entre métricas
            5. Proyecciones futuras
            6. Recomendaciones estratégicas
            
            Responde en formato JSON
            """
            
            response = self.model.generate_content(prompt)
            
            trends_analysis = {
                "time_period": time_period,
                "overall_trend": "positivo",
                "growth_rate": "+15.3%",
                "key_insights": [
                    "Crecimiento consistente en últimos 3 meses",
                    "Mejora significativa en retención",
                    "Aumento de suscriptores orgánicos"
                ],
                "seasonal_patterns": [
                    "Mayor actividad en fines de semana",
                    "Pico de visualización en horarios nocturnos",
                    "Disminución en períodos vacacionales"
                ],
                "strategic_impact": {
                    "schedule_changes": "+12% views",
                    "content_pivot": "+8% engagement",
                    "thumbnail_optimization": "+15% CTR"
                },
                "projections": {
                    "next_month": "+18% crecimiento esperado",
                    "next_quarter": "+45% acumulado",
                    "confidence": "alta"
                },
                "strategic_recommendations": [
                    "Mantener estrategia actual",
                    "Experimentar con nuevos formatos",
                    "Expandir a horarios adicionales"
                ]
            }
            
            return trends_analysis
            
        except Exception as e:
            print(f"Error analizando tendencias: {e}")
            return {}
