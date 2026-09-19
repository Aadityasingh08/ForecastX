from fastapi import APIRouter
from app.schemas.routes import RouteWeatherRequest, RouteWeatherResponse
from app.services.route_service import route_service

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/weather", response_model=RouteWeatherResponse)
async def analyze_route_weather(req: RouteWeatherRequest):
    """
    Analyzes meteorological conditions across transit waypoints along a requested route.
    Calculates segment-specific risk, pinpoints high-hazard zones, and outputs actionable driver advisories.
    """
    origin = req.origin.strip()
    destination = req.destination.strip()
    return await route_service.analyze_route(origin, destination, departure_time=req.departure_time or "Now")
