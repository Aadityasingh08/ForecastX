from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from app.schemas.weather import CurrentWeather, DailyForecast, HourlyForecast, SourceCitation
from app.schemas.warnings import CAPWarning
from app.schemas.cyclone import CycloneData


class ChatMessageItem(BaseModel):
    sender: str  # user, assistant, system
    text: str
    timestamp: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: str = "en"  # en, hi
    user_location: Optional[str] = None
    context_history: Optional[List[ChatMessageItem]] = None


class WeatherContext(BaseModel):
    location: str
    district: Optional[str] = None
    state: Optional[str] = None
    coordinates: Dict[str, float]
    observation: Optional[CurrentWeather] = None
    hourly_forecast: Optional[List[HourlyForecast]] = None
    daily_forecast: Optional[List[DailyForecast]] = None
    warnings: List[CAPWarning] = []
    cyclone_data: Optional[CycloneData] = None
    sources: List[SourceCitation] = []
    geographic_scope: str = "city"  # city, district, state, corridor, national
    model: str = "IMD-GFS-Ensemble"
    uncertainty_notes: Optional[str] = None
    is_demo: bool = False


class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None
    intent: str
    entities: Dict[str, Any]
    risk_level: Optional[str] = "LOW"
    advisory: Optional[str] = None
    action: Optional[str] = None
    weather_context: Optional[WeatherContext] = None
    sources: List[SourceCitation] = []
    suggested_followups: List[str] = []
    language: str = "en"
