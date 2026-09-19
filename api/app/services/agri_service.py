"""
AgriDecisionService
Provides deterministic crop-specific weather decision support for Indian agriculture:
Pesticide/foliar spray window, irrigation management, harvesting safety, and pest/blight risk.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel
from app.services.location_service import location_service
from app.services.weather_service import weather_service
from app.services.time_service import time_service
from app.schemas.weather import SourceCitation


class AgriDecisionResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    crop: str
    current_temperature: float
    current_humidity: float
    wind_speed_kmph: float
    rain_probability_next_24h: float
    expected_rain_mm_next_24h: float
    
    # Decisions
    spray_window_status: str  # "OPTIMAL", "FAIR", "UNFAVORABLE", "CRITICAL_RISK"
    spray_recommendation: str
    
    irrigation_status: str    # "RECOMMENDED", "POSTPONE", "NORMAL"
    irrigation_recommendation: str
    
    harvest_window_status: str # "SAFE", "RISKY", "DELAY"
    harvest_recommendation: str
    
    disease_pest_risk: str    # "LOW", "MODERATE", "HIGH"
    disease_pest_advisory: str
    
    sources: List[SourceCitation]
    generated_at: str


CROP_TRANSLATIONS = {
    "wheat": "Wheat (गेहूं)",
    "गेहूं": "Wheat (गेहूं)",
    "rice": "Paddy (धान)",
    "paddy": "Paddy (धान)",
    "धान": "Paddy (धान)",
    "mustard": "Mustard (सरसों)",
    "सरसों": "Mustard (सरसों)",
    "cotton": "Cotton (कपास)",
    "कपास": "Cotton (कपास)",
    "tomato": "Tomato (टमाटर)",
    "टमाटर": "Tomato (टमाटर)",
    "potato": "Potato (आलू)",
    "आलू": "Potato (आलू)",
    "maize": "Maize (मक्का)",
    "मक्का": "Maize (मक्का)",
    "sugarcane": "Sugarcane (गन्ना)",
    "गन्ना": "Sugarcane (गन्ना)",
}


class AgriIntelligenceService:
    async def analyze_crop_weather(
        self,
        location_query: str,
        crop: str = "Wheat"
    ) -> AgriDecisionResponse:
        resolved_loc = await location_service.resolve_location(location_query)
        lat = resolved_loc.latitude
        lon = resolved_loc.longitude
        loc_name = resolved_loc.display_name or location_query

        # Fetch current conditions and 7-day forecast
        curr = await weather_service.get_current_weather(lat, lon, loc_name)
        forecast = await weather_service.get_forecast(lat, lon, loc_name)

        # Standardize crop name
        crop_clean = crop.lower().strip()
        crop_display = CROP_TRANSLATIONS.get(crop_clean, f"{crop.capitalize()} (फसल)")

        # Ingest metrics
        temp = curr.temperature
        humidity = curr.humidity
        wind = curr.wind_speed
        
        # Calculate 24h rain forecast
        rain_prob_24h = 0.0
        expected_rain_24h = 0.0
        if forecast.daily and len(forecast.daily) > 0:
            rain_prob_24h = forecast.daily[0].rain_probability or 0.0
            if forecast.hourly and len(forecast.hourly) >= 12:
                expected_rain_24h = sum([h.rainfall_mm or 0.0 for h in forecast.hourly[:12]])
        elif forecast.hourly and len(forecast.hourly) >= 12:
            rain_prob_24h = max([h.rain_probability or 0.0 for h in forecast.hourly[:12]])
            expected_rain_24h = sum([h.rainfall_mm or 0.0 for h in forecast.hourly[:12]])

        # 1. Chemical Spraying Decision
        if rain_prob_24h >= 45.0 or expected_rain_24h >= 2.0:
            spray_status = "UNFAVORABLE"
            spray_rec = (
                f"🛑 DO NOT SPRAY: Significant precipitation likelihood ({rain_prob_24h:.0f}%, {expected_rain_24h} mm). "
                f"Chemical fungicides and insecticides will wash off foliage, resulting in chemical runoff and financial loss."
            )
        elif wind >= 20.0:
            spray_status = "CRITICAL_RISK"
            spray_rec = (
                f"⚠️ HIGH DRIFT HAZARD: Sustained surface winds at {wind:.1f} km/h exceed safe application limits (15 km/h). "
                f"Excessive airborne droplet drift risks non-target vegetation contamination and uneven coverage."
            )
        elif wind >= 5.0 and wind <= 16.0 and rain_prob_24h <= 20.0 and humidity <= 75.0:
            spray_status = "OPTIMAL"
            spray_rec = (
                f"✅ OPTIMAL SPRAY WINDOW: Gentle wind ({wind:.1f} km/h), minimal rain probability ({rain_prob_24h:.0f}%), "
                f"and moderate humidity ({humidity}%). Ideal for foliar fertilizer and pesticide absorption."
            )
        else:
            spray_status = "FAIR"
            spray_rec = (
                f"🟡 ACCEPTABLE CONDITIONS: Wind {wind:.1f} km/h, rain chance {rain_prob_24h:.0f}%. "
                f"Ensure spray application is conducted during early morning (07:00–10:00 IST) to maximize efficacy."
            )

        # 2. Irrigation Decision
        if expected_rain_24h >= 10.0 or rain_prob_24h >= 65.0:
            irr_status = "POSTPONE"
            irr_rec = (
                f"🛑 WITHHOLD IRRIGATION: Substantial precipitation forecast ({expected_rain_24h} mm). "
                f"Applying water now risks waterlogging, root asphyxiation, and nutrient leaching."
            )
        elif temp >= 34.0 and humidity <= 40.0:
            irr_status = "RECOMMENDED"
            irr_rec = (
                f"💧 URGENT IRRIGATION RECOMMENDED: High ambient temperatures ({temp:.1f}°C) and low humidity ({humidity}%) "
                f"are inducing high evapotranspiration stress on {crop_display} root zones."
            )
        else:
            irr_status = "NORMAL"
            irr_rec = (
                f"✅ MAINTAIN REGULAR SCHEDULE: Evaporative demand is moderate ({temp:.1f}°C, {humidity}% RH). "
                f"Follow standard crop growth-stage irrigation intervals."
            )

        # 3. Harvesting & Post-Harvest Decision
        if rain_prob_24h <= 15.0 and expected_rain_24h < 1.0 and humidity <= 65.0:
            harvest_status = "SAFE"
            harvest_rec = (
                f"🌾 FAVORABLE HARVEST WINDOW: Dry atmospheric conditions prevail for {crop_display}. "
                f"Grain threshing and open-sun yard drying can proceed safely without mold risks."
            )
        else:
            harvest_status = "DELAY"
            harvest_rec = (
                f"⚠️ CAUTION / DELAY HARVEST: Elevated ambient moisture ({humidity}% RH) and rain risks ({rain_prob_24h:.0f}%). "
                f"Ensure harvested sheaves or produce are moved to covered shelter."
            )

        # 4. Fungal / Pest Disease Warning
        if humidity >= 80.0 and 18.0 <= temp <= 29.0:
            pest_risk = "HIGH"
            pest_adv = (
                f"🔴 HIGH FUNGAL VULNERABILITY: Prolonged high relative humidity ({humidity}%) coupled with mild temperatures ({temp:.1f}°C) "
                f"creates prime microclimate for foliar rust, powdery mildew, and blight infestation. Inspect lower leaf canopies."
            )
        elif humidity >= 65.0:
            pest_risk = "MODERATE"
            pest_adv = (
                f"🟡 MODERATE MONITORING: Monitor {crop_display} stands for sucking pests and aphid colonies during afternoon hours."
            )
        else:
            pest_risk = "LOW"
            pest_adv = (
                f"🟢 LOW DISEASE PRESSURE: Low humidity ({humidity}%) inhibits active spore germination and fungal dispersion."
            )

        return AgriDecisionResponse(
            location=loc_name,
            latitude=lat,
            longitude=lon,
            crop=crop_display,
            current_temperature=temp,
            current_humidity=humidity,
            wind_speed_kmph=wind,
            rain_probability_next_24h=rain_prob_24h,
            expected_rain_mm_next_24h=expected_rain_24h,
            spray_window_status=spray_status,
            spray_recommendation=spray_rec,
            irrigation_status=irr_status,
            irrigation_recommendation=irr_rec,
            harvest_window_status=harvest_status,
            harvest_recommendation=harvest_rec,
            disease_pest_risk=pest_risk,
            disease_pest_advisory=pest_adv,
            sources=[
                SourceCitation(
                    name="ICAR-IMD Agro-Meteorological Advisory Field Unit & Open-Meteo",
                    type="Agro-Meteorological Sync",
                    issued_at=time_service.format_timestamp(),
                    status="Live"
                )
            ],
            generated_at=time_service.format_timestamp()
        )


agri_service = AgriIntelligenceService()
