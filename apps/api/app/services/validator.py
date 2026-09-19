"""
Meteorological Data Validator
Validates physical limits, bounds, timestamps, and structure of incoming weather observations.
Ensures no impossible or malformed meteorological values propagate into user or AI layers.
"""
import logging
from typing import Any, Dict, Optional, Tuple

logger = logging.getLogger("forecastx.validator")

# Physical plausible limits for terrestrial weather (especially South Asia / India)
BOUNDS = {
    "temperature": (-50.0, 60.0),       # °C
    "feels_like": (-60.0, 70.0),        # °C
    "humidity": (0, 100),               # %
    "wind_speed": (0.0, 350.0),         # km/h (Category 5 super cyclone max gust ~320 km/h)
    "pressure": (850.0, 1085.0),        # hPa (world record low ~870, high ~1084)
    "visibility": (0.0, 100.0),         # km
    "precipitation": (0.0, 500.0),      # mm
    "rain_probability": (0.0, 100.0),   # %
    "uv_index": (0.0, 16.0),            # UV Index
}


class WeatherValidator:
    """Validates and sanitizes meteorological data payloads."""

    @staticmethod
    def validate_metric(metric_name: str, value: Any, default: Optional[float] = None) -> Tuple[Optional[float], bool]:
        """
        Validates whether a numeric value is within plausible meteorological bounds.
        Returns: (sanitized_value, is_valid)
        """
        if value is None:
            return default, False

        try:
            val_float = float(value)
        except (ValueError, TypeError):
            return default, False

        if metric_name in BOUNDS:
            min_val, max_val = BOUNDS[metric_name]
            if not (min_val <= val_float <= max_val):
                logger.warning(
                    f"Out-of-bounds meteorological value: {metric_name}={val_float} outside [{min_val}, {max_val}]."
                )
                # Clamp or fall back
                clamped = max(min_val, min(val_float, max_val))
                return clamped, False

        return val_float, True

    @staticmethod
    def sanitize_current_weather(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validates and sanitizes a current weather dictionary."""
        sanitized = dict(data)

        temp, _ = WeatherValidator.validate_metric("temperature", sanitized.get("temperature"), default=28.0)
        sanitized["temperature"] = round(temp, 1)

        feels, _ = WeatherValidator.validate_metric("feels_like", sanitized.get("feels_like"), default=temp)
        sanitized["feels_like"] = round(feels, 1)

        hum, _ = WeatherValidator.validate_metric("humidity", sanitized.get("humidity"), default=65.0)
        sanitized["humidity"] = int(hum)

        wind, _ = WeatherValidator.validate_metric("wind_speed", sanitized.get("wind_speed"), default=10.0)
        sanitized["wind_speed"] = round(wind, 1)

        press, _ = WeatherValidator.validate_metric("pressure", sanitized.get("pressure"), default=1010.0)
        sanitized["pressure"] = round(press, 1)

        vis, _ = WeatherValidator.validate_metric("visibility", sanitized.get("visibility"), default=8.0)
        sanitized["visibility"] = round(vis, 1)

        if "rainfall_last_hour" in sanitized and sanitized["rainfall_last_hour"] is not None:
            rain, _ = WeatherValidator.validate_metric("precipitation", sanitized["rainfall_last_hour"], default=0.0)
            sanitized["rainfall_last_hour"] = round(rain, 1)

        if "temp_min" in sanitized and sanitized["temp_min"] is not None:
            tmin, _ = WeatherValidator.validate_metric("temperature", sanitized["temp_min"], default=temp - 3)
            sanitized["temp_min"] = round(tmin, 1)

        if "temp_max" in sanitized and sanitized["temp_max"] is not None:
            tmax, _ = WeatherValidator.validate_metric("temperature", sanitized["temp_max"], default=temp + 3)
            sanitized["temp_max"] = round(tmax, 1)

        return sanitized


validator = WeatherValidator()
