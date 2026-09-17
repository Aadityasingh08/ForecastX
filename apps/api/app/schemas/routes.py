from typing import List, Optional
from pydantic import BaseModel
from app.schemas.weather import SourceCitation


class RouteWarningInfo(BaseModel):
    severity: str
    hazard: str
    message: str


class RouteCheckpoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    distance_from_start_km: float
    estimated_arrival_time: str
    condition: str
    temperature: float
    rainfall_mm: float
    wind_kmph: float
    warning: Optional[RouteWarningInfo] = None


class RouteWeatherRequest(BaseModel):
    origin: str  # e.g. "Delhi" or "28.61,77.20"
    destination: str  # e.g. "Jaipur" or "26.91,75.78"
    departure_time: Optional[str] = None


class RouteWeatherResponse(BaseModel):
    start_location: str
    destination_location: str
    total_distance_km: float
    estimated_duration_hours: float
    summary: str
    has_adverse_weather: bool
    severe_section_alert: Optional[str] = None
    checkpoints: List[RouteCheckpoint]
    sources: List[SourceCitation]
    is_demo: bool = False
