from typing import List, Optional
from app.providers.demo import DEMO_WARNINGS
from app.schemas.warnings import CAPWarning
from app.gis.spatial import point_in_polygon


class WarningEngine:
    def __init__(self):
        self._warnings: List[CAPWarning] = list(DEMO_WARNINGS)

    def get_all_warnings(
        self,
        hazard: Optional[str] = None,
        severity: Optional[str] = None,
        state: Optional[str] = None,
        active_only: bool = True
    ) -> List[CAPWarning]:
        results = self._warnings
        if hazard:
            results = [w for w in results if hazard.lower() in w.hazard.lower()]
        if severity:
            results = [w for w in results if severity.lower() == w.severity.lower()]
        if state:
            results = [w for w in results if state.lower() in w.state.lower() or state.lower() in w.area_desc.lower()]
        return results

    def get_by_id(self, warning_id: str) -> Optional[CAPWarning]:
        for w in self._warnings:
            if w.id == warning_id:
                return w
        return None

    def get_warnings_for_location(self, lat: float, lon: float, state_name: Optional[str] = None) -> List[CAPWarning]:
        matched = []
        for w in self._warnings:
            # check polygon if present
            if w.coordinates and point_in_polygon(lat, lon, w.coordinates):
                matched.append(w)
            elif state_name and state_name.lower() in w.state.lower():
                matched.append(w)
        return matched


warning_engine = WarningEngine()
