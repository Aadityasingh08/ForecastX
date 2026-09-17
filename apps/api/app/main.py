import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import (
    admin,
    advisories,
    auth,
    chat,
    climate,
    cyclones,
    health,
    locations,
    routes,
    warnings,
    weather,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("forecastx.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================")
    logger.info(f"Starting {settings.APP_NAME} - {settings.APP_TAGLINE}")
    logger.info(f"Environment: {settings.APP_ENV} | DEMO_MODE: {settings.DEMO_MODE}")
    logger.info(f"LLM Provider: {settings.LLM_PROVIDER}")
    logger.info("Authoritative Weather Adapters Initialized (IMD, MOSDAC, ECMWF, WMO)")
    logger.info("==================================================")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=f"{settings.APP_NAME} Meteorological Intelligence API",
    description="Authoritative, conversational, and spatial weather intelligence platform for India.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers with /api prefix
app.include_router(health.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(warnings.router, prefix="/api")
app.include_router(cyclones.router, prefix="/api")
app.include_router(routes.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(advisories.router, prefix="/api")
app.include_router(climate.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "docs": "/docs",
        "status": "online"
    }
