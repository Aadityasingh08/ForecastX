from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.weather import CurrentWeather, HourlyForecast, DailyForecast, WeatherStation, RainfallData
from app.schemas.warnings import CAPWarning


class WeatherProvider(ABC):
    """Abstract interface for all meteorological data providers in ForecastX."""

    @abstractmethod
    async def get_current_weather(self, lat: float, lon: float, location_name: Optional[str] = None) -> CurrentWeather:
        """Fetch real-time weather observation for given coordinates or location name."""
        pass

    @abstractmethod
    async def get_hourly_forecast(self, lat: float, lon: float) -> List[HourlyForecast]:
        """Fetch 24-hour hourly forecast."""
        pass

    @abstractmethod
    async def get_daily_forecast(self, lat: float, lon: float) -> List[DailyForecast]:
        """Fetch 7-day daily forecast."""
        pass

    @abstractmethod
    async def get_warnings(self, state: Optional[str] = None) -> List[CAPWarning]:
        """Fetch official active warnings."""
        pass

    @abstractmethod
    async def get_rainfall(self, location_name: Optional[str] = None) -> List[RainfallData]:
        """Fetch rainfall measurements and nowcast status."""
        pass

    @abstractmethod
    async def get_stations(self) -> List[WeatherStation]:
        """Fetch active meteorological observation stations."""
        pass
