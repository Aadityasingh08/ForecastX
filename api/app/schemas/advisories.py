from typing import List, Optional
from pydantic import BaseModel


class AgriAdvisoryItem(BaseModel):
    id: str
    state: str
    district: str
    crop: str
    growth_stage: str
    current_weather_summary: str
    official_advisory: str
    spray_recommendation: Optional[str] = None
    irrigation_recommendation: Optional[str] = None
    potential_risks: Optional[str] = None
    issued_at: str
    valid_until: str
    source: str = "IMD Agrometeorological Advisory Services (AAS)"


class MarineWeatherReport(BaseModel):
    station_or_port: str
    state: str
    latitude: float
    longitude: float
    wave_height_meters: float
    swell_direction: str
    swell_period_seconds: float
    wind_speed_knots: float
    wind_direction: str
    sea_state: str  # Calm, Smooth, Slight, Moderate, Rough, Very Rough
    visibility_km: float
    coastal_warning: Optional[str] = None
    fishermen_warning: Optional[str] = None
    issued_at: str
    source: str = "INCOIS / IMD Marine Division"


class AviationWeatherReport(BaseModel):
    airport_icao: str
    airport_iata: str
    airport_name: str
    city: str
    metar_raw: str
    observation_time: str
    wind_direction_degrees: int
    wind_speed_knots: int
    visibility_meters: int
    temperature_c: float
    dewpoint_c: float
    altimeter_qnh_hpa: int
    flight_category: str  # VFR, MVFR, IFR, LIFR
    cloud_ceiling_feet: Optional[int] = None
    clouds_description: str
    trend: str
    source: str = "IMD Aviation Meteorological Services"


class ModelComparisonEntry(BaseModel):
    name: str  # IMD-NWP, ECMWF-IFS, NOAA-GFS
    run_timestamp: str
    temperature_c: float
    rainfall_mm: float
    wind_speed_kmph: float
    confidence_level: str


class ModelComparisonResponse(BaseModel):
    location: str
    forecast_date: str
    models: List[ModelComparisonEntry]
    disagreement_detected: bool
    disagreement_details: Optional[str] = None
    uncertainty_notes: str
    source_attribution: List[str]


class VerificationMetric(BaseModel):
    location: str
    model_name: str
    period: str
    mae_temperature: float
    rmse_temperature: float
    bias_temperature: float
    rainfall_accuracy_score: float
    sample_count: int
