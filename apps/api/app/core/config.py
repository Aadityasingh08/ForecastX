import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ForecastX"
    APP_TAGLINE: str = "Conversational Weather Intelligence for a Safer India"
    APP_ENV: str = "development"
    DEMO_MODE: bool = True

    # Database
    @classmethod
    def _default_db_url(cls) -> str:
        # Check serverless markers
        if any(k in os.environ for k in ("VERCEL", "AWS_LAMBDA_FUNCTION_NAME", "LAMBDA_TASK_ROOT", "NOW_REGION", "VERCEL_REGION")):
            return "sqlite:////tmp/forecastx.db"
        try:
            from pathlib import Path
            test_f = Path("./.w_test")
            test_f.touch()
            test_f.unlink()
            return "sqlite:///./forecastx.db"
        except Exception:
            return "sqlite:////tmp/forecastx.db"

    DATABASE_URL: str = _default_db_url.__func__(None)
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    JWT_SECRET: str = "forecastx-authoritative-met-key-2026-safe-india"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # AI Providers
    LLM_PROVIDER: str = "fallback"  # 'gemini', 'openai', 'local', 'fallback'
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    LOCAL_LLM_URL: str = "http://localhost:11434/v1"

    # External Met Services
    IMD_API_KEY: Optional[str] = None
    IMD_API_BASE_URL: str = "https://mausam.imd.gov.in/api"
    ECMWF_API_KEY: Optional[str] = None
    ECMWF_URL: Optional[str] = "https://api.ecmwf.int/v1"
    MOSDAC_CONFIG: Optional[str] = None

    # GIS / Map
    MAP_TILE_URL: str = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    GEOCODING_PROVIDER: str = "internal"

    # Voice Providers
    TTS_PROVIDER: str = "browser"  # 'browser', 'gtts', 'elevenlabs'
    STT_PROVIDER: str = "browser"  # 'browser', 'whisper'

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
