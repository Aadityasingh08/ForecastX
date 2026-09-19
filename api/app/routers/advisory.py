"""
Advisory Router
Exposes dedicated decision intelligence APIs for agriculture (Kisan Copilot),
outdoor event feasibility, and official meteorological briefing exports.
"""
from fastapi import APIRouter, Query
from app.services.agri_service import agri_service, AgriDecisionResponse
from app.services.event_service import event_service, EventFeasibilityResponse
from app.services.location_service import location_service
from app.services.weather_service import weather_service
from app.services.risk_engine import risk_engine
from app.services.time_service import time_service

router = APIRouter(prefix="/advisory", tags=["Advisory Intelligence"])


@router.get("/agri", response_model=AgriDecisionResponse)
async def get_agri_advisory(
    location: str = Query(..., description="Target Indian district or city"),
    crop: str = Query("Wheat", description="Crop name (e.g. Wheat, Paddy, Mustard, Tomato)")
):
    """
    Returns deterministic agricultural weather decision intelligence including
    pesticide spraying window, irrigation management, and crop health risk.
    """
    return await agri_service.analyze_crop_weather(location_query=location, crop=crop)


@router.get("/event-feasibility", response_model=EventFeasibilityResponse)
async def get_event_feasibility(
    location: str = Query(..., description="Target city or location"),
    event_type: str = Query("wedding", description="Event type: wedding, cricket, marathon, construction, concert"),
    days_ahead: int = Query(0, ge=0, le=6, description="Days ahead (0 for today, 1 for tomorrow, etc.)")
):
    """
    Returns a deterministic 0-100 event feasibility score and risk breakdown for outdoor gatherings.
    """
    return await event_service.evaluate_event(
        location_query=location,
        event_type=event_type,
        days_ahead=days_ahead
    )


@router.get("/briefing")
async def get_meteorological_briefing(
    location: str = Query(..., description="Location name for official briefing")
):
    """
    Generates a structured, authoritative Meteorological Decision Briefing
    with formatted WhatsApp copy-paste payload and printable executive summary.
    """
    resolved = await location_service.resolve_location(location)
    curr = await weather_service.get_current_weather(resolved.latitude, resolved.longitude, resolved.display_name)
    forecast = await weather_service.get_forecast(resolved.latitude, resolved.longitude, resolved.display_name)
    
    # Calculate deterministic risk
    risk_assessment = risk_engine.evaluate_weather_risk(curr)
    
    # Rain prob in next 24h
    rain_prob = forecast.daily[0].rain_probability if forecast.daily and forecast.daily[0].rain_probability is not None else 20.0
    rain_sum = curr.rainfall_last_hour or 0.0

    # Build WhatsApp Share Text
    whatsapp_text = (
        f"🚨 *FORECASTX METEOROLOGICAL BRIEFING*\n"
        f"📍 *Location:* {resolved.display_name}\n"
        f"⏰ *Issued:* {time_service.format_timestamp()}\n"
        f"─────────────────────\n"
        f"🌡️ *Temp:* {curr.temperature}°C (Feels like {curr.feels_like}°C)\n"
        f"💧 *Humidity:* {curr.humidity}%\n"
        f"💨 *Wind:* {curr.wind_speed} km/h\n"
        f"🌧️ *Rain Probability:* {rain_prob:.0f}% ({rain_sum} mm)\n"
        f"─────────────────────\n"
        f"⚠️ *RISK LEVEL:* *{risk_assessment.overall_risk}*\n"
        f"📋 *Advisory:* {risk_assessment.advisory}\n"
        f"🛡️ *Recommended Action:* {risk_assessment.action}\n"
        f"─────────────────────\n"
        f"📡 *Source:* Open-Meteo & IMD Synoptic Sync\n"
        f"🔗 *Grounded Decision Intelligence: ForecastX*"
    )

    return {
        "location": resolved.display_name,
        "latitude": resolved.latitude,
        "longitude": resolved.longitude,
        "issued_at": time_service.format_timestamp(),
        "current_weather": curr,
        "risk_assessment": risk_assessment,
        "daily_forecast": forecast.daily[:5] if forecast.daily else [],
        "whatsapp_text": whatsapp_text,
        "source": "ForecastX Grounded Meteorological Decision Suite"
    }
