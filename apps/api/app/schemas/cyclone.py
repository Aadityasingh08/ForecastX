from typing import List, Optional
from pydantic import BaseModel


class CycloneTrackPoint(BaseModel):
    time: str
    latitude: float
    longitude: float
    category: str
    wind_speed_kmph: float
    pressure_hpa: float
    is_forecast: bool = False


class CycloneData(BaseModel):
    id: str
    name: str
    basin: str  # Bay of Bengal, Arabian Sea, Indian Ocean
    current_category: str
    severity: str  # Severe, High, Moderate
    center_latitude: float
    center_longitude: float
    movement_direction: str
    movement_speed_kmph: float
    max_sustained_wind_kmph: float
    estimated_central_pressure_hpa: float
    expected_landfall_location: str
    expected_landfall_time: str
    affected_states: List[str]
    track: List[CycloneTrackPoint]
    warnings: List[str]
    last_updated: str
    satellite_image_url: Optional[str] = None
    is_demo: bool = False
