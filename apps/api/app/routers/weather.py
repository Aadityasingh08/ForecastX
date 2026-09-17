from typing import List, Optional
from fastapi import APIRouter, Query
from app.providers.demo import DEMO_CITIES, demo_provider
from app.providers.imd import imd_provider
from app.schemas.weather import CurrentWeather, DailyForecast, HourlyForecast, RainfallData, WeatherForecastResponse, WeatherStation
from app.schemas.warnings import CAPWarning
from app.warnings.engine import warning_engine

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("/warnings", response_model=List[CAPWarning])
async def get_weather_warnings(
    hazard: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    active_only: bool = Query(True)
):
    return warning_engine.get_all_warnings(hazard=hazard, severity=severity, state=state, active_only=active_only)


@router.get("/current", response_model=CurrentWeather)
async def get_current_weather(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    latitude = lat if lat is not None else 28.6139
    longitude = lon if lon is not None else 77.2090
    return await imd_provider.get_current_weather(latitude, longitude, city)


@router.get("/strip", response_model=List[CurrentWeather])
async def get_top_cities_strip():
    """Returns the top 4 flagship cities for the dashboard strip (New Delhi, Mumbai, Chennai, Kolkata)."""
    cities = ["delhi", "mumbai", "chennai", "kolkata"]
    results = []
    for c in cities:
        data = DEMO_CITIES[c]
        cw = await demo_provider.get_current_weather(data["latitude"], data["longitude"], data["city_name"])
        results.append(cw)
    return results


@router.get("/forecast", response_model=WeatherForecastResponse)
async def get_forecast(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    city: Optional[str] = Query(None)
):
    latitude = lat if lat is not None else 28.6139
    longitude = lon if lon is not None else 77.2090
    current = await imd_provider.get_current_weather(latitude, longitude, city)
    hourly = await imd_provider.get_hourly_forecast(latitude, longitude)
    daily = await imd_provider.get_daily_forecast(latitude, longitude)

    return WeatherForecastResponse(
        location_id=current.location_id,
        city_name=current.city_name,
        district=current.district,
        state=current.state,
        latitude=latitude,
        longitude=longitude,
        hourly=hourly,
        daily=daily,
        source="IMD / MOSDAC Multi-Model Guidance",
        issued_at="17 Sep 2026, 08:30 IST",
        model="IMD GFS-Ensemble 0.12°",
        is_demo=current.is_demo
    )


@router.get("/hourly", response_model=List[HourlyForecast])
async def get_hourly_forecast(lat: float = 28.6139, lon: float = 77.2090):
    return await imd_provider.get_hourly_forecast(lat, lon)


@router.get("/daily", response_model=List[DailyForecast])
async def get_daily_forecast(lat: float = 28.6139, lon: float = 77.2090):
    return await imd_provider.get_daily_forecast(lat, lon)


@router.get("/rainfall", response_model=List[RainfallData])
async def get_rainfall():
    return await imd_provider.get_rainfall()


@router.get("/stations", response_model=List[WeatherStation])
async def get_stations():
    return await imd_provider.get_stations()
