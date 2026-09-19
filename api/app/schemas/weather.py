from typing import List, Optional
from pydantic import BaseModel, Field


class SourceCitation(BaseModel):
    name: str
    type: str  # Observation, Forecast, Warning, Satellite, Radar, Model
    issued_at: str
    valid_until: Optional[str] = None
    model: Optional[str] = None
    url: Optional[str] = None
    status: str = "Live"  # Live, Demo, Fallback


class CurrentWeather(BaseModel):
    location_id: str
    city_name: str
    district: str
    state: str
    latitude: float
    longitude: float
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    condition: str
    condition_code: str
    humidity: int
    wind_speed: float  # km/h
    wind_direction: str
    pressure: float  # hPa
    visibility: float  # km
    uv_index: Optional[float] = None
    rainfall_last_hour: Optional[float] = 0.0  # mm
    observed_at: str
    source: str
    is_demo: bool = False


class HourlyForecast(BaseModel):
    time: str
    temperature: float
    condition: str
    rain_probability: Optional[float] = None  # None if unstated by official source
    rainfall_mm: float
    wind_speed: float
    humidity: int


class DailyForecast(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    condition: str
    rainfall_summary: str
    rain_probability: Optional[float] = None
    warning_severity: Optional[str] = None


class WeatherForecastResponse(BaseModel):
    location_id: str
    city_name: str
    district: str
    state: str
    latitude: float
    longitude: float
    hourly: List[HourlyForecast]
    daily: List[DailyForecast]
    source: str
    issued_at: str
    model: str
    is_demo: bool = False


class WeatherStation(BaseModel):
    station_id: str
    station_name: str
    state: str
    district: str
    latitude: float
    longitude: float
    elevation_meters: Optional[float] = None
    station_type: str = "AWS"  # AWS, ARG, Doppler Radar, Cyclone Warning Center
    is_active: bool = True
    last_reported_at: Optional[str] = None


class RainfallData(BaseModel):
    location_name: str
    district: str
    state: str
    current_intensity_mm_per_hr: float
    accumulated_24h_mm: float
    anomaly_percentage: Optional[float] = None
    status: str  # Normal, Excess, Large Excess, Deficient
    last_updated: str
    source: str


class LocationSearchResult(BaseModel):
    id: str
    name: str
    district: str
    state: str
    country: str = "India"
    pincode: Optional[str] = None
    latitude: float
    longitude: float
    type: str  # city, district, airport, landmark
    display_name: Optional[str] = None

