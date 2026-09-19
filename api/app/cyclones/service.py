from typing import List, Optional
from app.schemas.cyclone import CycloneData, CycloneTrackPoint

CYCLONE_BOB = CycloneData(
    id="CYC-BOB-2026-02",
    name="Severe Cyclonic Storm (Bay of Bengal)",
    basin="Bay of Bengal",
    current_category="Severe Cyclonic Storm",
    severity="Severe",
    center_latitude=18.2,
    center_longitude=88.5,
    movement_direction="NW",
    movement_speed_kmph=12.0,
    max_sustained_wind_kmph=120.0,
    estimated_central_pressure_hpa=984.0,
    expected_landfall_location="Between Puri and Sagar Island, near Dhamra Port (Odisha)",
    expected_landfall_time="18 Sep 2026 (evening)",
    affected_states=["Odisha", "West Bengal", "Andhra Pradesh"],
    track=[
        CycloneTrackPoint(time="16 Sep 05:30 IST", latitude=15.4, longitude=91.2, category="Depression", wind_speed_kmph=55.0, pressure_hpa=1000.0, is_forecast=False),
        CycloneTrackPoint(time="16 Sep 17:30 IST", latitude=16.5, longitude=90.1, category="Deep Depression", wind_speed_kmph=75.0, pressure_hpa=994.0, is_forecast=False),
        CycloneTrackPoint(time="17 Sep 05:30 IST", latitude=17.4, longitude=89.2, category="Cyclonic Storm", wind_speed_kmph=95.0, pressure_hpa=988.0, is_forecast=False),
        CycloneTrackPoint(time="17 Sep 10:30 IST", latitude=18.2, longitude=88.5, category="Severe Cyclonic Storm", wind_speed_kmph=120.0, pressure_hpa=984.0, is_forecast=False),
        # Forecast track
        CycloneTrackPoint(time="17 Sep 23:30 IST", latitude=19.1, longitude=87.8, category="Severe Cyclonic Storm", wind_speed_kmph=125.0, pressure_hpa=980.0, is_forecast=True),
        CycloneTrackPoint(time="18 Sep 11:30 IST", latitude=19.9, longitude=87.2, category="Severe Cyclonic Storm", wind_speed_kmph=120.0, pressure_hpa=982.0, is_forecast=True),
        CycloneTrackPoint(time="18 Sep 17:30 IST", latitude=20.8, longitude=86.9, category="Landfall (Severe CS)", wind_speed_kmph=115.0, pressure_hpa=985.0, is_forecast=True),
        CycloneTrackPoint(time="19 Sep 05:30 IST", latitude=21.6, longitude=86.4, category="Cyclonic Storm", wind_speed_kmph=70.0, pressure_hpa=992.0, is_forecast=True),
    ],
    warnings=[
        "Red message for coastal districts of North Odisha (Bhadrak, Balasore, Kendrapara)",
        "Gale wind speed reaching 100-110 kmph gusting to 120 kmph",
        "Storm surge of 1.0 to 1.5 meters above astronomical tide likely to inundate low-lying coastal areas",
        "Total suspension of fishing operations in North Bay of Bengal"
    ],
    last_updated="17 Sep 2026, 10:30 AM IST",
    satellite_image_url="/assets/cyclone_eye.png",
    is_demo=True
)


class CycloneService:
    @staticmethod
    def get_active_cyclones() -> List[CycloneData]:
        return [CYCLONE_BOB]

    @staticmethod
    def get_cyclone_by_id(cyclone_id: str) -> Optional[CycloneData]:
        if cyclone_id == CYCLONE_BOB.id or cyclone_id == "latest":
            return CYCLONE_BOB
        return None


cyclone_service = CycloneService()
