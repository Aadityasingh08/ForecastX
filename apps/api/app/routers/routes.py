from fastapi import APIRouter
from app.gis.spatial import haversine_distance_km
from app.schemas.routes import RouteCheckpoint, RouteWeatherRequest, RouteWeatherResponse, RouteWarningInfo
from app.schemas.weather import SourceCitation

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/weather", response_model=RouteWeatherResponse)
async def analyze_route_weather(req: RouteWeatherRequest):
    origin = req.origin.strip()
    destination = req.destination.strip()

    # Special dedicated high-resolution corridor for Delhi -> Jaipur
    if ("delhi" in origin.lower() and "jaipur" in destination.lower()) or ("jaipur" in origin.lower() and "delhi" in destination.lower()):
        return RouteWeatherResponse(
            start_location="New Delhi (Dhaula Kuan)",
            destination_location="Jaipur (Sindhi Camp)",
            total_distance_km=268.0,
            estimated_duration_hours=4.5,
            summary="Moderate to heavy thunderstorm activity detected along the Kotputli-Behror stretch (NH-48). High risk of sudden reduced visibility and surface water accumulation between km 120 and km 160.",
            has_adverse_weather=True,
            severe_section_alert="Thunderstorm & Heavy Rain Alert: Km 120-160 (Kotputli)",
            checkpoints=[
                RouteCheckpoint(
                    name="New Delhi (Departure)",
                    latitude=28.5833,
                    longitude=77.1667,
                    distance_from_start_km=0.0,
                    estimated_arrival_time="11:00 AM",
                    condition="Haze",
                    temperature=32.0,
                    rainfall_mm=0.0,
                    wind_kmph=14.0
                ),
                RouteCheckpoint(
                    name="Gurgaon / Manesar",
                    latitude=28.3588,
                    longitude=76.9400,
                    distance_from_start_km=42.0,
                    estimated_arrival_time="11:45 AM",
                    condition="Partly Cloudy",
                    temperature=31.0,
                    rainfall_mm=0.0,
                    wind_kmph=16.0
                ),
                RouteCheckpoint(
                    name="Neemrana / Behror",
                    latitude=27.9868,
                    longitude=76.3858,
                    distance_from_start_km=122.0,
                    estimated_arrival_time="01:00 PM",
                    condition="Light Rain Showers",
                    temperature=29.0,
                    rainfall_mm=4.5,
                    wind_kmph=22.0
                ),
                RouteCheckpoint(
                    name="Kotputli (Severe Weather Zone)",
                    latitude=27.7025,
                    longitude=76.2008,
                    distance_from_start_km=156.0,
                    estimated_arrival_time="01:40 PM",
                    condition="Severe Thunderstorm & Torrential Rain",
                    temperature=26.5,
                    rainfall_mm=28.0,
                    wind_kmph=42.0,
                    warning=RouteWarningInfo(
                        severity="High",
                        hazard="Thunderstorm & Strong Wind",
                        message="Squally winds up to 45 km/h and localized waterlogging reported on NH 48."
                    )
                ),
                RouteCheckpoint(
                    name="Shahpura",
                    latitude=27.3872,
                    longitude=75.9592,
                    distance_from_start_km=205.0,
                    estimated_arrival_time="02:30 PM",
                    condition="Overcast & Wet Roads",
                    temperature=28.0,
                    rainfall_mm=6.0,
                    wind_kmph=18.0
                ),
                RouteCheckpoint(
                    name="Jaipur (Arrival)",
                    latitude=26.9124,
                    longitude=75.7873,
                    distance_from_start_km=268.0,
                    estimated_arrival_time="03:30 PM",
                    condition="Mostly Cloudy",
                    temperature=30.0,
                    rainfall_mm=0.2,
                    wind_kmph=12.0
                )
            ],
            sources=[
                SourceCitation(
                    name="IMD Doppler Radar Delhi & Jaipur",
                    type="Radar",
                    issued_at="17 Sep 2026, 10:15 IST",
                    status="Demo"
                ),
                SourceCitation(
                    name="National Highways Authority Highway Weather Feed",
                    type="Observation",
                    issued_at="17 Sep 2026, 10:20 IST",
                    status="Demo"
                )
            ],
            is_demo=True
        )

    # General route calculation
    dist = 180.0
    return RouteWeatherResponse(
        start_location=origin,
        destination_location=destination,
        total_distance_km=dist,
        estimated_duration_hours=3.2,
        summary=f"Route from {origin} to {destination} is generally clear with scattered cloud cover and favorable driving conditions.",
        has_adverse_weather=False,
        checkpoints=[
            RouteCheckpoint(
                name=f"{origin} (Start)",
                latitude=28.6,
                longitude=77.2,
                distance_from_start_km=0.0,
                estimated_arrival_time="11:00 AM",
                condition="Clear",
                temperature=31.0,
                rainfall_mm=0.0,
                wind_kmph=12.0
            ),
            RouteCheckpoint(
                name="Midway Junction",
                latitude=28.0,
                longitude=76.8,
                distance_from_start_km=90.0,
                estimated_arrival_time="12:30 PM",
                condition="Partly Cloudy",
                temperature=30.5,
                rainfall_mm=0.0,
                wind_kmph=14.0
            ),
            RouteCheckpoint(
                name=f"{destination} (Destination)",
                latitude=27.4,
                longitude=76.4,
                distance_from_start_km=dist,
                estimated_arrival_time="02:15 PM",
                condition="Fair",
                temperature=29.8,
                rainfall_mm=0.0,
                wind_kmph=10.0
            )
        ],
        sources=[
            SourceCitation(
                name="IMD Regional NWP",
                type="Model",
                issued_at="17 Sep 2026, 08:30 IST",
                status="Demo"
            )
        ],
        is_demo=True
    )
