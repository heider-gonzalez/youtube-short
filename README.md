# 🎬 YouTube Shorts Automation System

Sistema automatizado para generación y gestión de videos de YouTube Shorts con IA, optimizado para monetización y crecimiento explosivo.

## 🚀 Características Principales

### 🤖 Generación de Contenido con IA
- **Scripts optimizados** para YouTube Shorts usando Gemini AI
- **Generación de imágenes** con DALL-E 3 y otras APIs
- **Narración profesional** con ElevenLabs
- **Análisis de tendencias** en tiempo real
- **Optimización de metadatos** para SEO

### 📊 Analytics e Inteligencia
- **Análisis profundo** del canal con Gemini AI
- **Seguimiento de RPM** y monetización
- **Análisis de retención** de audiencia
- **Recomendaciones de mejora** automáticas
- **Detección de spam** y cumplimiento de normas

### 🎯 Gestión Multi-Canal
- **Gestión simultánea** de múltiples canales
- **Campañas automatizadas** por nicho
- **Programación inteligente** de publicaciones
- **Análisis comparativo** entre canales

### 💰 Optimización de Monetización
- **Identificación de nichos** de alto RPM
- **Análisis de regiones** con mayor potencial
- **Optimización de horarios** de publicación
- **Estrategias de contenido** para audiencias de alto valor

## 🏗️ Arquitectura

```
youtube-automation/
├── backend-python/          # Backend Python (IA y Análisis)
│   ├── src/
│   │   ├── main.py         # FastAPI principal
│   │   ├── routers/        # Endpoints API
│   │   ├── services/       # Lógica de negocio
│   │   ├── models/         # Modelos de datos
│   │   └── utils/          # Utilidades
│   └── requirements.txt
├── backend-nodejs/         # Backend Node.js (Automatización)
│   ├── src/
│   │   ├── index.js        # Express principal
│   │   ├── routes/         # Endpoints API
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # Utilidades
│   └── package.json
├── frontend/               # Dashboard React
├── database/               # Schema PostgreSQL
│   └── schema.sql
├── .env.example            # Variables de entorno
└── README.md
```

## 🛠️ Tech Stack

### Backend Python
- **FastAPI**: Framework API moderno y rápido
- **Gemini AI**: Análisis y generación de contenido
- **OpenAI**: DALL-E para imágenes
- **ElevenLabs**: Narración de voz
- **MoviePy**: Procesamiento de video
- **SQLAlchemy**: ORM para base de datos

### Backend Node.js
- **Express**: Framework API robusto
- **YouTube API**: Integración oficial
- **Bull + Redis**: Colas de tareas
- **node-cron**: Programación de tareas
- **Winston**: Logging profesional

### Base de Datos
- **PostgreSQL**: Base de datos principal
- **Redis**: Colas y caché

### Frontend
- **React**: Dashboard de gestión
- **TypeScript**: Type safety
- **Material-UI**: Componentes UI

## 📋 Requisitos Previos

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Cuentas de API:
  - YouTube Data API v3
  - Google Gemini API
  - OpenAI API
  - ElevenLabs API

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd youtube-automation
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar base de datos
```bash
# Crear base de datos PostgreSQL
createdb youtube_automation

# Ejecutar schema
psql youtube_automation < database/schema.sql
```

### 4. Instalar dependencias Python
```bash
cd backend-python
pip install -r requirements.txt
```

### 5. Instalar dependencias Node.js
```bash
cd backend-nodejs
npm install
```

### 6. Iniciar Redis
```bash
redis-server
```

### 7. Iniciar servidores

**Backend Python (IA):**
```bash
cd backend-python
python src/main.py
```

**Backend Node.js (Automatización):**
```bash
cd backend-nodejs
npm start
```

**Frontend (Dashboard):**
```bash
cd frontend
npm start
```

## 🎯 Uso

### 1. Autenticar con YouTube
```bash
POST /api/youtube/auth
{
  "code": "authorization_code_from_oauth"
}
```

### 2. Crear campaña
```bash
POST /api/automation/campaign
{
  "name": "Campaña Tecnología",
  "channelId": "channel_uuid",
  "niche": "Tecnología",
  "language": "es",
  "videosPerDay": 3,
  "style": "viral",
  "schedule": {
    "times": ["09:00", "15:00", "21:00"],
    "days": ["mon", "wed", "fri"]
  }
}
```

### 3. Generar video
```bash
POST /api/content/generate
{
  "niche": "Tecnología",
  "topic": "Nuevos gadgets 2024",
  "style": "viral",
  "language": "es",
  "duration": 60
}
```

### 4. Analizar tendencias
```bash
POST /api/trends/analyze
{
  "niche": "Tecnología",
  "region": "US",
  "language": "en",
  "time_period": "7d"
}
```

### 5. Obtener analytics
```bash
POST /api/analytics/analyze
{
  "channel_id": "channel_uuid",
  "metrics": ["views", "watchTime", "retention"]
}
```

## 📊 API Endpoints

### Backend Python (Port 8000)

#### Content Generation
- `POST /api/content/generate` - Generar contenido con IA
- `POST /api/content/create-video` - Crear video final
- `GET /api/content/trending-topics/{niche}` - Obtener temas trending

#### Analytics
- `POST /api/analytics/analyze` - Analizar analytics del canal
- `GET /api/analytics/recommendations/{channel_id}` - Obtener recomendaciones
- `GET /api/analytics/rpm-analysis/{channel_id}` - Analizar RPM
- `GET /api/analytics/retention-analysis/{video_id}` - Analizar retención

#### Trends
- `POST /api/trends/analyze` - Analizar tendencias de nicho
- `GET /api/trends/viral-topics` - Obtener temas virales
- `GET /api/trends/high-rpm-niches` - Nichos de alto RPM
- `GET /api/trends/growth-opportunities` - Oportunidades de crecimiento

#### Gemini Integration
- `POST /api/gemini/generate` - Generar contenido con Gemini
- `POST /api/gemini/analyze-channel` - Analizar canal con Gemini
- `GET /api/gemini/spam-check` - Verificar cumplimiento normas

### Backend Node.js (Port 3001)

#### YouTube
- `POST /api/youtube/auth` - Autenticar con YouTube
- `GET /api/youtube/channel/{channelId}` - Info del canal
- `POST /api/youtube/upload` - Subir video
- `GET /api/youtube/stats/{channelId}` - Estadísticas
- `GET /api/youtube/analytics/{channelId}` - Analytics detallados
- `GET /api/youtube/trending` - Videos trending

#### Automation
- `POST /api/automation/campaign` - Crear campaña
- `GET /api/automation/campaigns` - Listar campañas
- `POST /api/automation/campaign/{id}/generate` - Generar video
- `POST /api/automation/campaign/{id}/toggle` - Pausar/reanudar

#### Queue
- `POST /api/queue/add` - Añadir tarea a cola
- `GET /api/queue/status` - Estado de colas
- `DELETE /api/queue/job/{jobId}` - Cancelar job

## 🎨 Nichos Recomendados (Alto RPM)

1. **Finanzas Personales** - RPM: $18.50
2. **Tecnología y Gadgets** - RPM: $15.20
3. **Marketing Digital** - RPM: $14.80
4. **Educación Profesional** - RPM: $11.50
5. **Salud y Fitness** - RPM: $12.30

## 🌍 Regiones con Alto RPM

1. **Estados Unidos** - RPM: $15.50
2. **Australia** - RPM: $12.30
3. **Canadá** - RPM: $11.80
4. **Reino Unido** - RPM: $10.90
5. **Alemania** - RPM: $9.50

## 🚫 Normas y Cumplimiento

El sistema incluye verificación automática de:
- ✅ Contenido engañoso
- ✅ Spam y repetición excesiva
- ✅ Derechos de autor
- ✅ Contenido ofensivo
- ✅ Manipulación de métricas
- ✅ Clickbait excesivo

## 📈 Estrategias de Crecimiento

### 1. Optimización de Contenido
- **Ganchos fuertes** en primeros 3 segundos
- **Duración óptima**: 58-59 segundos
- **Call-to-action** clara y temprana
- **Formatos virales**: antes/después, tutoriales, tips

### 2. Programación Inteligente
- **Horarios óptimos** según audiencia
- **Frecuencia consistente** (1-3 videos/día)
- **Análisis de picos** de actividad
- **Adaptación regional** de horarios

### 3. Multi-Nicho
- **Diversificación** en 2-3 nichos
- **Análisis de rendimiento** por nicho
- **Reasignación de recursos** a nichos exitosos
- **Testing continuo** de nuevos nichos

## 🔐 Seguridad

- **Tokens encriptados** en base de datos
- **Rate limiting** en APIs
- **Verificación de spam** automática
- **Cumplimiento GDPR** para datos europeos
- **Logs seguros** sin información sensible

## 🐛 Troubleshooting

### Error: YouTube quota exceeded
- Solución: Esperar reset de cuota (diario) o optimizar requests

### Error: Gemini API rate limit
- Solución: Implementar retry con exponential backoff

### Error: Video generation failed
- Solución: Verificar APIs de OpenAI/ElevenLabs activas

### Error: Database connection failed
- Solución: Verificar PostgreSQL corriendo y credenciales correctas

## 📝 TODO

- [ ] Completar dashboard React
- [ ] Implementar sistema de notificaciones
- [ ] Añadir testing automatizado
- [ ] Documentación API completa (Swagger)
- [ ] Sistema de backup y recuperación
- [ ] Analytics en tiempo real
- [ ] Optimización de costos de APIs

## 🤝 Contribución

Este es un proyecto privado para automatización de YouTube. No se aceptan contribuciones externas actualmente.

## ⚠️ Disclaimer

Este sistema es para uso educativo y debe utilizarse cumpliendo estrictamente con:
- Términos de servicio de YouTube
- Leyes de derechos de autor
- Normas de contenido comunitario
- Regulaciones locales de cada región

El uso indebido puede resultar en:
- Suspensión del canal
- Desmonetización
- Acciones legales

## 📄 Licencia

Propiedad privada. Todos los derechos reservados.

## 📞 Soporte

Para issues o preguntas, contactar al administrador del sistema.

---

**Generado con Devin AI** - Sistema de Automatización de YouTube Shorts
