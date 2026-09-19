from datetime import datetime, timezone
from typing import Dict, List, Optional
from app.providers.base import WeatherProvider
from app.schemas.weather import CurrentWeather, DailyForecast, HourlyForecast, RainfallData, WeatherStation
from app.schemas.warnings import CAPWarning
from app.gis.spatial import haversine_distance_km


DEMO_CITIES: Dict[str, Dict] = {
    "delhi": {
        "location_id": "loc-delhi",
        "city_name": "New Delhi",
        "district": "New Delhi",
        "state": "Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "temperature": 32.0,
        "feels_like": 35.0,
        "temp_min": 26.0,
        "temp_max": 34.0,
        "condition": "Haze",
        "condition_code": "haze",
        "humidity": 62,
        "wind_speed": 14.0,
        "wind_direction": "NW",
        "pressure": 1008.0,
        "visibility": 4.0,
        "uv_index": 6.5,
        "rainfall_last_hour": 0.0,
        "observed_at": "10:30 AM",
        "source": "IMD Safdarjung Observatory",
        "is_demo": True
    },
    "mumbai": {
        "location_id": "loc-mumbai",
        "city_name": "Mumbai",
        "district": "Mumbai City",
        "state": "Maharashtra",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "temperature": 28.0,
        "feels_like": 32.0,
        "temp_min": 25.0,
        "temp_max": 31.0,
        "condition": "Light Rain",
        "condition_code": "light-rain",
        "humidity": 88,
        "wind_speed": 22.0,
        "wind_direction": "WSW",
        "pressure": 1004.0,
        "visibility": 6.0,
        "uv_index": 4.0,
        "rainfall_last_hour": 3.2,
        "observed_at": "10:30 AM",
        "source": "IMD Colaba Observatory",
        "is_demo": True
    },
    "chennai": {
        "location_id": "loc-chennai",
        "city_name": "Chennai",
        "district": "Chennai",
        "state": "Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "temperature": 31.0,
        "feels_like": 36.0,
        "temp_min": 26.0,
        "temp_max": 33.0,
        "condition": "Partly Cloudy",
        "condition_code": "partly-cloudy",
        "humidity": 74,
        "wind_speed": 18.0,
        "wind_direction": "SE",
        "pressure": 1010.0,
        "visibility": 8.0,
        "uv_index": 8.0,
        "rainfall_last_hour": 0.0,
        "observed_at": "10:30 AM",
        "source": "IMD Nungambakkam Observatory",
        "is_demo": True
    },
    "kolkata": {
        "location_id": "loc-kolkata",
        "city_name": "Kolkata",
        "district": "Kolkata",
        "state": "West Bengal",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "temperature": 29.0,
        "feels_like": 34.0,
        "temp_min": 25.0,
        "temp_max": 32.0,
        "condition": "Thunderstorms",
        "condition_code": "thunderstorm",
        "humidity": 92,
        "wind_speed": 28.0,
        "wind_direction": "ESE",
        "pressure": 1002.0,
        "visibility": 3.0,
        "uv_index": 3.5,
        "rainfall_last_hour": 14.5,
        "observed_at": "10:30 AM",
        "source": "IMD Alipore Observatory",
        "is_demo": True
    },
    "kanpur": {
        "location_id": "loc-kanpur",
        "city_name": "Kanpur",
        "district": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "latitude": 26.4499,
        "longitude": 80.3319,
        "temperature": 30.5,
        "feels_like": 35.0,
        "temp_min": 24.0,
        "temp_max": 33.0,
        "condition": "Overcast",
        "condition_code": "overcast",
        "humidity": 78,
        "wind_speed": 16.0,
        "wind_direction": "ENE",
        "pressure": 1006.0,
        "visibility": 5.0,
        "uv_index": 5.0,
        "rainfall_last_hour": 1.5,
        "observed_at": "10:30 AM",
        "source": "IMD Chakeri Observatory",
        "is_demo": True
    },
    "jaipur": {
        "location_id": "loc-jaipur",
        "city_name": "Jaipur",
        "district": "Jaipur",
        "state": "Rajasthan",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "temperature": 30.0,
        "feels_like": 32.0,
        "temp_min": 23.0,
        "temp_max": 33.0,
        "condition": "Mostly Cloudy",
        "condition_code": "cloudy",
        "humidity": 55,
        "wind_speed": 12.0,
        "wind_direction": "WNW",
        "pressure": 1009.0,
        "visibility": 7.0,
        "uv_index": 7.0,
        "rainfall_last_hour": 0.0,
        "observed_at": "10:30 AM",
        "source": "IMD Sanganer Observatory",
        "is_demo": True
    },
    "bhubaneswar": {
        "location_id": "loc-bhubaneswar",
        "city_name": "Bhubaneswar",
        "district": "Khordha",
        "state": "Odisha",
        "latitude": 20.2961,
        "longitude": 85.8245,
        "temperature": 27.5,
        "feels_like": 31.0,
        "temp_min": 23.0,
        "temp_max": 29.0,
        "condition": "Heavy Rain & Squall",
        "condition_code": "heavy-rain",
        "humidity": 95,
        "wind_speed": 45.0,
        "wind_direction": "NE",
        "pressure": 996.0,
        "visibility": 2.0,
        "uv_index": 2.0,
        "rainfall_last_hour": 24.0,
        "observed_at": "10:30 AM",
        "source": "IMD Meteorological Centre Bhubaneswar",
        "is_demo": True
    }
}

DEMO_WARNINGS: List[CAPWarning] = [
    CAPWarning(
        id="WARN-CAP-2026-001",
        source="IMD National Cyclone Warning Centre (New Delhi)",
        hazard="Cyclone",
        severity="High",
        urgency="Immediate",
        certainty="Observed",
        headline="Cyclone Alert: Severe Cyclonic Storm approaching North Odisha - West Bengal coasts",
        description="The Severe Cyclonic Storm over Westcentral and adjoining Northwest Bay of Bengal moved northwestwards with a speed of 12 kmph and lay centered over Lat 18.2 N and Lon 88.5 E. Gale wind speed reaching 100-110 kmph gusting to 120 kmph prevailing over the central Bay of Bengal. Landfall expected near Dhamra Port, Odisha on 18 Sep evening.",
        instruction="Fishermen are advised not to venture into deep sea areas of Bay of Bengal. Complete suspension of fishing operations. Total evacuation of vulnerable coastal lowlands. Secure thatched dwellings and power lines.",
        area_desc="North Odisha coastal districts (Balasore, Bhadrak, Kendrapara, Jagatsinghpur) and West Bengal coastal areas",
        state="Odisha",
        district="Bhadrak, Balasore, Kendrapara",
        issued_at="17 Sep 2026, 08:30 IST",
        effective_at="17 Sep 2026, 09:00 IST",
        expires_at="18 Sep 2026, 18:00 IST",
        is_demo=True,
        coordinates=[
            [86.5, 20.5], [87.5, 20.8], [88.2, 21.8], [87.8, 22.2], [86.2, 21.2]
        ]
    ),
    CAPWarning(
        id="WARN-CAP-2026-002",
        source="IMD Regional Meteorological Centre (Kolkata)",
        hazard="Heavy Rain",
        severity="Moderate",
        urgency="Expected",
        certainty="Likely",
        headline="Heavy to Very Heavy Rainfall Warning for Coastal Odisha & Andhra Pradesh",
        description="Under the influence of the cyclonic storm, heavy to very heavy rainfall (70-200 mm) is expected over coastal districts with isolated extremely heavy falls (>200 mm) likely.",
        instruction="Waterlogging likely in low lying areas. Localized flooding of roads. Keep storm water drainage lines clear.",
        area_desc="Odisha coastal belt and North Coastal Andhra Pradesh",
        state="Odisha",
        district="Puri, Khordha, Cuttack",
        issued_at="17 Sep 2026, 09:00 IST",
        effective_at="17 Sep 2026, 10:00 IST",
        expires_at="17 Sep 2026, 23:59 IST",
        is_demo=True
    ),
    CAPWarning(
        id="WARN-CAP-2026-003",
        source="IMD Regional Meteorological Centre (New Delhi / Patna)",
        hazard="Thunderstorm",
        severity="Watch",
        urgency="Expected",
        certainty="Likely",
        headline="Thunderstorm & Lightning with gusty winds over Bihar, Jharkhand, West Bengal",
        description="Thunderstorm accompanied with lightning and surface winds (speed 30-40 kmph) likely at isolated places over Bihar, Jharkhand, and Gangetic West Bengal.",
        instruction="Stay indoors during lightning activity. Do not take shelter under isolated tall trees. Unplug sensitive electrical equipment.",
        area_desc="Bihar, Jharkhand, West Bengal Gangetic plains",
        state="West Bengal",
        district="Kolkata, Howrah, Hooghly",
        issued_at="17 Sep 2026, 09:30 IST",
        effective_at="17 Sep 2026, 10:30 IST",
        expires_at="17 Sep 2026, 21:00 IST",
        is_demo=True
    )
]


class DemoWeatherProvider(WeatherProvider):
    """Authoritative Demo Provider with realistic Indian meteorological data."""

    def _resolve_key(self, location_name: Optional[str], lat: Optional[float] = None, lon: Optional[float] = None) -> str:
        if location_name:
            low = location_name.lower().strip()
            for key in DEMO_CITIES:
                if key in low or low in key:
                    return key
        if lat is not None and lon is not None:
            # find closest
            closest_key = "delhi"
            min_dist = float("inf")
            for key, data in DEMO_CITIES.items():
                d = haversine_distance_km(lat, lon, data["latitude"], data["longitude"])
                if d < min_dist:
                    min_dist = d
                    closest_key = key
            return closest_key
        return "delhi"

    async def get_current_weather(self, lat: float, lon: float, location_name: Optional[str] = None) -> CurrentWeather:
        key = self._resolve_key(location_name, lat, lon)
        data = DEMO_CITIES[key]
        return CurrentWeather(**data)

    async def get_hourly_forecast(self, lat: float, lon: float) -> List[HourlyForecast]:
        key = self._resolve_key(None, lat, lon)
        base_temp = DEMO_CITIES[key]["temperature"]
        is_kanpur = key == "kanpur"
        is_bhubaneswar = key == "bhubaneswar"

        hours = [
            ("11:00 AM", 0.0, 0.0),
            ("12:00 PM", 0.5, 0.0),
            ("01:00 PM", 1.0, 0.0),
            ("02:00 PM", 1.5, 0.0),
            ("03:00 PM", 1.0, 0.2),
            ("04:00 PM", 0.0, 0.5),
            ("05:00 PM", -1.0, 1.2),
            ("06:00 PM", -2.0, 1.8),
            ("07:00 PM", -2.5, 0.8),
            ("08:00 PM", -3.0, 0.4),
            ("09:00 PM", -3.5, 0.0),
            ("10:00 PM", -4.0, 0.0),
        ]

        forecasts = []
        for time_str, dt, rain_add in hours:
            rain = rain_add
            cond = DEMO_CITIES[key]["condition"]
            prob = None

            if is_kanpur:
                cond = "Scattered Showers" if rain_add > 0 else "Cloudy"
                rain = round(rain_add * 2.5, 1)
                prob = 75.0  # Official IMD probability of precipitation
            elif is_bhubaneswar:
                cond = "Heavy Squalls & Rain"
                rain = round(12.0 + rain_add * 4, 1)
                prob = 95.0

            forecasts.append(HourlyForecast(
                time=time_str,
                temperature=round(base_temp + dt, 1),
                condition=cond,
                rain_probability=prob,
                rainfall_mm=rain,
                wind_speed=DEMO_CITIES[key]["wind_speed"],
                humidity=DEMO_CITIES[key]["humidity"]
            ))
        return forecasts

    async def get_daily_forecast(self, lat: float, lon: float) -> List[DailyForecast]:
        key = self._resolve_key(None, lat, lon)
        city = DEMO_CITIES[key]

        if key == "kanpur":
            return [
                DailyForecast(
                    date="2026-09-17",
                    day_name="Today",
                    temp_max=33.0,
                    temp_min=24.0,
                    condition="Cloudy with light rain",
                    rainfall_summary="5-10 mm isolated",
                    rain_probability=60.0
                ),
                DailyForecast(
                    date="2026-09-18",
                    day_name="Tomorrow",
                    temp_max=29.0,
                    temp_min=23.0,
                    condition="Moderate to Heavy Rain",
                    rainfall_summary="25-45 mm widespread precipitation expected",
                    rain_probability=85.0,
                    warning_severity="Moderate"
                ),
                DailyForecast(
                    date="2026-09-19",
                    day_name="Fri",
                    temp_max=31.0,
                    temp_min=24.0,
                    condition="Light showers",
                    rainfall_summary="5-15 mm",
                    rain_probability=50.0
                ),
                DailyForecast(
                    date="2026-09-20",
                    day_name="Sat",
                    temp_max=32.0,
                    temp_min=25.0,
                    condition="Partly Cloudy",
                    rainfall_summary="Isolated traces",
                    rain_probability=20.0
                ),
                DailyForecast(
                    date="2026-09-21",
                    day_name="Sun",
                    temp_max=33.0,
                    temp_min=25.0,
                    condition="Sunny intervals",
                    rainfall_summary="No rain",
                    rain_probability=10.0
                )
            ]

        # Standard daily forecast
        return [
            DailyForecast(
                date="2026-09-17",
                day_name="Today",
                temp_max=city["temp_max"],
                temp_min=city["temp_min"],
                condition=city["condition"],
                rainfall_summary="Localized activity",
                rain_probability=40.0
            ),
            DailyForecast(
                date="2026-09-18",
                day_name="Tomorrow",
                temp_max=city["temp_max"] + 1,
                temp_min=city["temp_min"],
                condition=city["condition"],
                rainfall_summary="As per seasonal normal",
                rain_probability=35.0
            ),
            DailyForecast(
                date="2026-09-19",
                day_name="Fri",
                temp_max=city["temp_max"],
                temp_min=city["temp_min"] - 1,
                condition="Clear sky with clouds",
                rainfall_summary="Dry",
                rain_probability=15.0
            ),
            DailyForecast(
                date="2026-09-20",
                day_name="Sat",
                temp_max=city["temp_max"] - 1,
                temp_min=city["temp_min"] - 1,
                condition="Fair",
                rainfall_summary="Dry",
                rain_probability=10.0
            ),
            DailyForecast(
                date="2026-09-21",
                day_name="Sun",
                temp_max=city["temp_max"] + 1,
                temp_min=city["temp_min"],
                condition="Partly Cloudy",
                rainfall_summary="Trace",
                rain_probability=20.0
            )
        ]

    async def get_warnings(self, state: Optional[str] = None) -> List[CAPWarning]:
        if not state:
            return DEMO_WARNINGS
        return [w for w in DEMO_WARNINGS if state.lower() in w.state.lower()]

    async def get_rainfall(self, location_name: Optional[str] = None) -> List[RainfallData]:
        return [
            RainfallData(
                location_name="Bhubaneswar AWS",
                district="Khordha",
                state="Odisha",
                current_intensity_mm_per_hr=24.0,
                accumulated_24h_mm=118.5,
                anomaly_percentage=142.0,
                status="Large Excess",
                last_updated="10:30 AM",
                source="IMD Real-Time AWS Network"
            ),
            RainfallData(
                location_name="Kolkata Alipore",
                district="Kolkata",
                state="West Bengal",
                current_intensity_mm_per_hr=14.5,
                accumulated_24h_mm=62.0,
                anomaly_percentage=45.0,
                status="Excess",
                last_updated="10:30 AM",
                source="IMD Real-Time AWS Network"
            ),
            RainfallData(
                location_name="Kanpur Chakeri",
                district="Kanpur Nagar",
                state="Uttar Pradesh",
                current_intensity_mm_per_hr=1.5,
                accumulated_24h_mm=18.0,
                anomaly_percentage=12.0,
                status="Normal",
                last_updated="10:30 AM",
                source="IMD Real-Time AWS Network"
            ),
            RainfallData(
                location_name="Mumbai Colaba",
                district="Mumbai",
                state="Maharashtra",
                current_intensity_mm_per_hr=3.2,
                accumulated_24h_mm=38.4,
                anomaly_percentage=-5.0,
                status="Normal",
                last_updated="10:30 AM",
                source="IMD Real-Time AWS Network"
            )
        ]

    async def get_stations(self) -> List[WeatherStation]:
        return [
            WeatherStation(
                station_id="STN-42182",
                station_name="Safdarjung Observatory",
                state="Delhi",
                district="New Delhi",
                latitude=28.5833,
                longitude=77.2000,
                elevation_meters=216.0,
                station_type="Synoptic / AWS",
                is_active=True,
                last_reported_at="10:30 AM"
            ),
            WeatherStation(
                station_id="STN-43003",
                station_name="Colaba Observatory",
                state="Maharashtra",
                district="Mumbai City",
                latitude=18.8980,
                longitude=72.8100,
                elevation_meters=11.0,
                station_type="Marine AWS / Synoptic",
                is_active=True,
                last_reported_at="10:30 AM"
            ),
            WeatherStation(
                station_id="STN-42809",
                station_name="Alipore Observatory",
                state="West Bengal",
                district="Kolkata",
                latitude=22.5333,
                longitude=88.3333,
                elevation_meters=6.0,
                station_type="Doppler Weather Radar / AWS",
                is_active=True,
                last_reported_at="10:30 AM"
            ),
            WeatherStation(
                station_id="STN-43279",
                station_name="Meenambakkam Observatory",
                state="Tamil Nadu",
                district="Chennai",
                latitude=12.9900,
                longitude=80.1800,
                elevation_meters=16.0,
                station_type="Airport AWS / Synoptic",
                is_active=True,
                last_reported_at="10:30 AM"
            ),
            WeatherStation(
                station_id="STN-42971",
                station_name="Bhubaneswar MC",
                state="Odisha",
                district="Khordha",
                latitude=20.2500,
                longitude=85.8300,
                elevation_meters=45.0,
                station_type="Cyclone Warning Radar / AWS",
                is_active=True,
                last_reported_at="10:30 AM"
            )
        ]


demo_provider = DemoWeatherProvider()
