import re
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple
from app.ai.prompts import METEOROLOGICAL_SYSTEM_PROMPT
from app.ai.providers.fallback_provider import fallback_llm
from app.ai.providers.gemini_provider import gemini_llm
from app.core.config import settings
from app.cyclones.service import cyclone_service
from app.gis.spatial import interpolate_route_points
from app.providers.demo import DEMO_CITIES, demo_provider
from app.schemas.chat import ChatResponse, WeatherContext
from app.schemas.weather import SourceCitation
from app.warnings.engine import warning_engine


class AIPipeline:
    def __init__(self):
        self.llm = gemini_llm if settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY else fallback_llm

    def detect_intent_and_entities(self, query: str) -> Tuple[str, Dict[str, Any]]:
        q = query.lower().strip()
        entities: Dict[str, Any] = {"language": "en"}

        if "hindi" in q or "हिंदी" in q:
            entities["language"] = "hi"

        # Detect intent
        if "cyclone" in q or "threat" in q or "landfall" in q:
            intent = "CYCLONE"
        elif "route" in q or "from" in q and "to" in q or "along" in q:
            intent = "ROUTE_WEATHER"
        elif "agri" in q or "farm" in q or "crop" in q or "punjab" in q:
            intent = "AGRICULTURE"
        elif "compare" in q or "ecmwf" in q or "gfs" in q or "model" in q:
            intent = "MODEL_COMPARISON"
        elif "rain" in q or "precipitation" in q or "shower" in q:
            intent = "RAINFALL"
        elif "warning" in q or "alert" in q:
            intent = "WARNING"
        elif "marine" in q or "sea" in q or "coastal" in q or "wave" in q:
            intent = "MARINE"
        elif "flight" in q or "airport" in q or "aviation" in q:
            intent = "AVIATION"
        elif "tomorrow" in q or "week" in q or "forecast" in q:
            intent = "FORECAST"
        else:
            intent = "CURRENT_WEATHER"

        # Location extraction
        for city in ["kanpur", "delhi", "mumbai", "kolkata", "chennai", "jaipur", "bhubaneswar", "punjab", "odisha"]:
            if city in q:
                entities["location"] = city.capitalize()
                break

        if "route" in intent or ("delhi" in q and "jaipur" in q):
            entities["origin"] = "Delhi"
            entities["destination"] = "Jaipur"

        return intent, entities

    async def build_context(self, intent: str, entities: Dict[str, Any]) -> WeatherContext:
        loc_name = entities.get("location", "Delhi")
        key = loc_name.lower()
        if key not in DEMO_CITIES:
            key = "delhi"

        city_data = DEMO_CITIES[key]
        obs = await demo_provider.get_current_weather(city_data["latitude"], city_data["longitude"], loc_name)
        hourly = await demo_provider.get_hourly_forecast(city_data["latitude"], city_data["longitude"])
        daily = await demo_provider.get_daily_forecast(city_data["latitude"], city_data["longitude"])
        warnings = warning_engine.get_all_warnings(state=loc_name if intent != "CYCLONE" else "Odisha")
        cyclone = cyclone_service.get_cyclone_by_id("latest") if ("cyclone" in intent.lower() or "odisha" in loc_name.lower()) else None

        sources = [
            SourceCitation(
                name="India Meteorological Department (IMD)",
                type="Forecast",
                issued_at="17 Sep 2026, 08:30 IST",
                valid_until="18 Sep 2026, 18:00 IST",
                model="IMD GFS Ensemble",
                url="https://mausam.imd.gov.in",
                status="Demo"
            ),
            SourceCitation(
                name="ISRO MOSDAC",
                type="Satellite",
                issued_at="17 Sep 2026, 10:15 IST",
                model="INSAT-3DR Rapid Scan",
                url="https://mosdac.gov.in",
                status="Demo"
            ),
            SourceCitation(
                name="ECMWF Integrated Forecasting System",
                type="Model",
                issued_at="17 Sep 2026, 00:00 UTC",
                model="IFS HRES 0.1°",
                status="Demo"
            )
        ]

        return WeatherContext(
            location=loc_name,
            district=city_data["district"],
            state=city_data["state"],
            coordinates={"lat": city_data["latitude"], "lon": city_data["longitude"]},
            observation=obs,
            hourly_forecast=hourly,
            daily_forecast=daily,
            warnings=warnings,
            cyclone_data=cyclone,
            sources=sources,
            geographic_scope="city" if intent != "ROUTE_WEATHER" else "corridor",
            uncertainty_notes="High confidence in IMD-ECMWF convergence for rainfall timing.",
            is_demo=True
        )

    def generate_grounded_response(self, intent: str, entities: Dict[str, Any], context: WeatherContext) -> str:
        lang = entities.get("language", "en")
        loc = context.location

        if lang == "hi":
            # Natural Hindi response
            return (
                f"आज {loc} का मौसम: तापमान लगभग {context.observation.temperature}°C है और वर्तमान स्थिति "
                f"'{context.observation.condition}' है। आर्द्रता {context.observation.humidity}% दर्ज की गई है। "
                "भारतीय मौसम विभाग (IMD) के अनुसार आने वाले 24 घंटों में हल्की से मध्यम वर्षा की संभावना है। "
                "कृपया आधिकारिक चेतावनियों का पालन करें और सुरक्षित रहें।"
            )

        if intent == "CYCLONE" or "odisha" in loc.lower():
            cyc = context.cyclone_data
            return (
                f"⚠️ Official Cyclone Warning for Odisha Coast:\n\n"
                f"A {cyc.current_category} is active over the Northwest and Westcentral Bay of Bengal "
                f"(centered at Lat {cyc.center_latitude}°N, Lon {cyc.center_longitude}°E), moving {cyc.movement_direction} "
                f"at {cyc.movement_speed_kmph} km/h with sustained winds of {cyc.max_sustained_wind_kmph} km/h.\n\n"
                f"• Expected Landfall: {cyc.expected_landfall_location} on {cyc.expected_landfall_time}.\n"
                f"• Coastal Impact: Gale winds of 100–120 km/h and extremely heavy rainfall (>200 mm) likely across Balasore, Bhadrak, Kendrapara, and Jagatsinghpur.\n"
                f"• Advisory: Complete suspension of fishing operations. Residents in low-lying coastal belts are being evacuated by OSDMA and NDRF."
            )

        if intent == "ROUTE_WEATHER" or ("delhi" in loc.lower() and "jaipur" in loc.lower()):
            return (
                "🚗 Weather Corridor Analysis: New Delhi → Jaipur (NH 48):\n\n"
                "• New Delhi (Departure): 32°C, Hazy sunshine, clear roadway conditions.\n"
                "• Gurgaon / Manesar: 31°C, Partly cloudy, moderate traffic visibility.\n"
                "• Neemrana / Behror: 29°C, Cloud buildup with isolated light drizzles.\n"
                "• Kotputli (Weather Deterioration Zone): 27°C, Active Thunderstorm & heavy showers. Surface water runoff on highway.\n"
                "• Shahpura: 28°C, Overcast sky, wet roads.\n"
                "• Jaipur (Arrival): 30°C, Mostly cloudy, isolated sprinkles.\n\n"
                "⚠️ Safety Notice: Slow down between km 120 and km 160 (Kotputli stretch) due to sudden reduced visibility and wet surface conditions."
            )

        if intent == "AGRICULTURE":
            return (
                "🌾 Official Agrometeorological Advisory (Punjab & North India):\n\n"
                "• State: Punjab | Major Crops: Paddy (Rice) & Cotton\n"
                "• Current Condition: Temperature 31°C, Humidity 65%, dry weather expected over next 3 days.\n"
                "• Irrigation Advisory: Farmers are advised to apply light irrigation to late-sown paddy at grain-filling stage.\n"
                "• Pesticide Guidance: Do NOT spray pesticides or chemicals during windy afternoons (>15 km/h) to prevent drift.\n"
                "• Upcoming Rabi Preparation: Land preparation for wheat and mustard can commence in fields where summer moong has been harvested."
            )

        if intent == "MODEL_COMPARISON":
            return (
                "📊 Multi-Model Numerical Weather Prediction (NWP) Comparison for Delhi (Tomorrow):\n\n"
                "• IMD NWP (GFS-Ensemble): 31.5°C | Rainfall: 4.2 mm | Wind: 14 km/h NW | Confidence: High\n"
                "• ECMWF (IFS HRES): 30.8°C | Rainfall: 6.8 mm | Wind: 16 km/h NW | Confidence: High\n"
                "• NOAA GFS: 32.2°C | Rainfall: 1.5 mm | Wind: 12 km/h WNW | Confidence: Moderate\n\n"
                "⚖️ Disagreement Analysis: ECMWF projects slightly higher localized convective rainfall (6.8 mm) during late afternoon, whereas GFS indicates drier conditions. IMD's blended operational consensus forecasts isolated light showers (4.2 mm) with high consistency."
            )

        # Rain or Forecast for Kanpur / General
        if "kanpur" in loc.lower() or intent in ["RAINFALL", "FORECAST"]:
            return (
                f"🌧️ Forecast for {loc} (Tomorrow, 18 Sep 2026):\n\n"
                f"{loc} is expected to experience Moderate to Heavy Rainfall tomorrow.\n\n"
                "• Expected Rainfall: 25 mm to 45 mm widespread precipitation.\n"
                "• Probability of Precipitation: 85% (Official IMD Probability Guidance).\n"
                "• Temperatures: High of 29°C (drop of 4°C due to cloud cover), Low of 23°C.\n"
                "• Warning Level: Yellow Alert (Moderate Warning) issued by IMD for thunderstorms with gusty winds (30-40 km/h).\n\n"
                "Travelers and residents are advised to plan for wet roads and possible waterlogging in low-lying city stretches."
            )

        return (
            f"Currently in {loc}, the weather is {context.observation.condition} with a temperature of "
            f"{context.observation.temperature}°C (feels like {context.observation.feels_like}°C). "
            f"Humidity is {context.observation.humidity}% and winds are blowing from the {context.observation.wind_direction} "
            f"at {context.observation.wind_speed} km/h. High today will reach {context.observation.temp_max}°C."
        )


ai_pipeline = AIPipeline()
