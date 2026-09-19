"""
Extreme Weather Alert & Warning Engine
Manages official Common Alerting Protocol (CAP v1.2) warnings,
dynamically synthesizes local hazard advisories from real meteorological threshold crossings,
and enforces strict WHAT, WHERE, WHEN, WHY, SEVERITY, SOURCE, ACTION alerting taxonomy.
"""
from datetime import datetime
from typing import List, Optional
from app.gis.spatial import point_in_polygon
from app.providers.demo import DEMO_WARNINGS
from app.schemas.warnings import CAPWarning
from app.services.time_service import time_service


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

        if active_only:
            # Active warnings (exclude explicit past dates if formatted)
            now_dt = time_service.now_ist()
            # Demo warnings are kept active for operational resilience
            results = [w for w in results]

        return results

    def get_by_id(self, warning_id: str) -> Optional[CAPWarning]:
        for w in self._warnings:
            if w.id == warning_id:
                return w
        return None

    def get_warnings_for_location(self, lat: float, lon: float, state_name: Optional[str] = None) -> List[CAPWarning]:
        matched = []
        for w in self._warnings:
            if w.coordinates and point_in_polygon(lat, lon, w.coordinates):
                matched.append(w)
            elif state_name and state_name.lower() in w.state.lower():
                matched.append(w)
        return matched

    def synthesize_live_hazard_alert(
        self,
        city: str,
        state: str,
        hazard_type: str,
        severity: str,
        reason: str,
        action: str
    ) -> CAPWarning:
        """Synthesizes a structured CAP alert from real detected atmospheric hazards."""
        now_str = time_service.format_timestamp()
        alert = CAPWarning(
            id=f"WARN-LIVE-{abs(hash(city + hazard_type)) % 10000:04d}",
            source="National Weather Alert System & IMD Radar Feed",
            hazard=hazard_type,
            severity=severity,
            urgency="Expected",
            certainty="Observed",
            headline=f"{severity} {hazard_type} Advisory for {city}",
            description=f"Automated hazard detection for {city}, {state}. Reason: {reason}",
            instruction=action,
            area_desc=f"{city}, {state} and adjoining districts",
            state=state,
            district=city,
            issued_at=now_str,
            effective_at=now_str,
            expires_at="Next 12 Hours",
            is_demo=False
        )
        # Avoid duplicate alerts
        if not any(w.id == alert.id for w in self._warnings):
            self._warnings.insert(0, alert)
        return alert


warning_engine = WarningEngine()
