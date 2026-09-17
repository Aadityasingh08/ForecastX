from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "demo_mode": settings.DEMO_MODE,
        "llm_provider": settings.LLM_PROVIDER
    }


@router.get("/ready")
def get_ready():
    return {
        "status": "ready",
        "database": "connected",
        "spatial_engine": "active",
        "warning_feed": "active"
    }
