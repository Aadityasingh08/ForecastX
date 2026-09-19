from typing import List, Optional
from fastapi import APIRouter, Query
from app.providers.imd import imd_provider
from app.schemas.weather import CurrentWeather, DailyForecast, HourlyForecast, RainfallData, WeatherForecastResponse, WeatherStation
from app.schemas.warnings import CAPWarning
from app.services.weather_service import weather_service
from app.warnings.engine import warning_engine

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/warnings", response_model=List[CAPWarning])
async def get_weather_warnings(
    hazard: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    active_only: bool = Query(True)
):
    """Retrieves active meteorological warnings and alerts."""
    return warning_engine.get_all_warnings(hazard=hazard, severity=severity, state=state, active_only=active_only)


@router.get("/current", response_model=CurrentWeather)
async def get_current_weather(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    """Retrieves normalized current weather conditions from live meteorological networks."""
    return await weather_service.get_current_weather(lat=lat, lon=lon, city_name=city)


@router.get("/strip", response_model=List[CurrentWeather])
async def get_top_cities_strip():
    """Returns flagship metro cities for the top live weather strip (New Delhi, Mumbai, Chennai, Kolkata)."""
    cities = [
        ("New Delhi", 28.6139, 77.2090),
        ("Mumbai", 19.0760, 72.8777),
        ("Chennai", 13.0827, 80.2707),
        ("Kolkata", 22.5726, 88.3639),
    ]
    results = []
    for name, lat, lon in cities:
        try:
            cw = await weather_service.get_current_weather(lat=lat, lon=lon, city_name=name)
            results.append(cw)
        except Exception:
            # Fallback to demo item if single city fails
            demo_item = await imd_provider.get_current_weather(lat, lon, name)
            results.append(demo_item)
    return results


@router.get("/forecast", response_model=WeatherForecastResponse)
async def get_forecast(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    """Retrieves unified 24-hour hourly and 7-day daily forecasts."""
    return await weather_service.get_forecast(lat=lat, lon=lon, city_name=city)


@router.get("/hourly", response_model=List[HourlyForecast])
async def get_hourly_forecast(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    fc = await weather_service.get_forecast(lat=lat, lon=lon, city_name=city)
    return fc.hourly


@router.get("/daily", response_model=List[DailyForecast])
async def get_daily_forecast(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    fc = await weather_service.get_forecast(lat=lat, lon=lon, city_name=city)
    return fc.daily


@router.get("/rainfall", response_model=List[RainfallData])
async def get_rainfall(city: Optional[str] = Query(None)):
    return await imd_provider.get_rainfall(city)


@router.get("/stations", response_model=List[WeatherStation])
async def get_stations():
    return await imd_provider.get_stations()
