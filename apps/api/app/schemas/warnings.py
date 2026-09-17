from typing import List, Optional
from pydantic import BaseModel


class CAPWarning(BaseModel):
    id: str
    source: str
    hazard: str  # Cyclone, Heavy Rain, Thunderstorm, Lightning, Heat Wave, Cold Wave, Dense Fog, Strong Wind
    severity: str  # Severe, High, Moderate, Watch, Advisory
    urgency: str  # Immediate, Expected, Future, Past
    certainty: str  # Observed, Likely, Possible, Unlikely
    headline: str
    description: str
    instruction: str
    area_desc: str
    coordinates: Optional[List[List[float]]] = None  # Polygon coordinates [[lon, lat], ...]
    state: str
    district: Optional[str] = None
    issued_at: str
    effective_at: str
    expires_at: str
    is_demo: bool = False


class WarningFilterParams(BaseModel):
    state: Optional[str] = None
    hazard: Optional[str] = None
    severity: Optional[str] = None
    active_only: bool = True
