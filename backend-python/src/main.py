from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from dotenv import load_dotenv
import os

# Importar routers
from routers import (
    content_generation,
    analytics,
    trends,
    gemini_integration
)

# Cargar variables de entorno
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Iniciando Backend Python - IA y Análisis")
    yield
    # Shutdown
    print("🛑 Deteniendo Backend Python")

app = FastAPI(
    title="YouTube Automation AI Backend",
    description="Backend Python para generación de contenido con IA y análisis",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(content_generation.router, prefix="/api/content", tags=["Content Generation"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(trends.router, prefix="/api/trends", tags=["Trends"])
app.include_router(gemini_integration.router, prefix="/api/gemini", tags=["Gemini AI"])

@app.get("/")
async def root():
    return {
        "message": "YouTube Automation AI Backend",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PYTHON_BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
