import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import (
    admin,
    advisories,
    advisory,
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
    try:
        from app.models.db_models import init_db
        init_db()
        logger.info("ForecastX SQLite / PostgreSQL Database Initialized Successfully")
    except Exception as e:
        logger.warning(f"Database table initialization warning: {e}")
    logger.info("Authoritative Weather Adapters Initialized (Open-Meteo, IMD, MOSDAC, ECMWF, WMO)")
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

# Register API routers with /api and root prefixes for universal deployment compatibility (Local, Vercel, Proxies)
for pfx in ["/api", ""]:
    app.include_router(health.router, prefix=pfx)
    app.include_router(weather.router, prefix=pfx)
    app.include_router(warnings.router, prefix=pfx)
    app.include_router(cyclones.router, prefix=pfx)
    app.include_router(routes.router, prefix=pfx)
    app.include_router(chat.router, prefix=pfx)
    app.include_router(advisories.router, prefix=pfx)
    app.include_router(advisory.router, prefix=pfx)
    app.include_router(climate.router, prefix=pfx)
    app.include_router(locations.router, prefix=pfx)
    app.include_router(admin.router, prefix=pfx)
    app.include_router(auth.router, prefix=pfx)



@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "docs": "/docs",
        "status": "online"
    }
