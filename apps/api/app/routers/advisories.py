from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.advisories import AgriAdvisoryItem, AviationWeatherReport, MarineWeatherReport

router = APIRouter(tags=["Advisories & Specialized Sectors"])

DEMO_AGRI: List[AgriAdvisoryItem] = [
    AgriAdvisoryItem(
        id="AGRI-PB-001",
        state="Punjab",
        district="Ludhiana",
        crop="Paddy (Rice)",
        growth_stage="Grain Filling / Maturation",
        current_weather_summary="Maximum temperature 32°C, minimum 24°C. Relative humidity 68%. Dry weather likely during next 4 days.",
        official_advisory="Provide light irrigation during morning or evening hours. Monitor crops for false smut and sheath blight. Withhold irrigation 10-12 days before anticipated harvest.",
        spray_recommendation="Avoid spraying agrochemicals when wind speed exceeds 15 km/h to reduce drift losses.",
        irrigation_recommendation="Maintain 2-3 cm shallow water ponding only if soil moisture depletes significantly.",
        potential_risks="Risk of lodging if heavy winds occur post irrigation.",
        issued_at="17 Sep 2026, 06:00 IST",
        valid_until="21 Sep 2026, 18:00 IST",
        source="IMD Agrometeorological Advisory Services (AAS)"
    ),
    AgriAdvisoryItem(
        id="AGRI-UP-002",
        state="Uttar Pradesh",
        district="Kanpur Nagar",
        crop="Paddy & Pulses",
        growth_stage="Vegetative to Flowering",
        current_weather_summary="Moderate to heavy rain expected tomorrow (18 Sep). High humidity (>80%).",
        official_advisory="Drain out excess standing water from pulse fields (Urad/Moong) to prevent root rot. Postpone chemical sprays until clear weather resumes.",
        spray_recommendation="Strictly postpone insecticide/fungicide spraying due to rain wash-off hazard.",
        irrigation_recommendation="Suspend irrigation operations immediately.",
        potential_risks="Water stagnation risk in clayey alluvial soils.",
        issued_at="17 Sep 2026, 07:00 IST",
        valid_until="19 Sep 2026, 18:00 IST",
        source="IMD Agrometeorological Advisory Services (AAS)"
    )
]

DEMO_MARINE: List[MarineWeatherReport] = [
    MarineWeatherReport(
        station_or_port="Dhamra Port (North Odisha)",
        state="Odisha",
        latitude=20.8167,
        longitude=86.9667,
        wave_height_meters=4.5,
        swell_direction="SE",
        swell_period_seconds=11.5,
        wind_speed_knots=55,
        wind_direction="ENE",
        sea_state="Very Rough",
        visibility_km=2.0,
        coastal_warning="Red Alert: Great Danger Signal hoisted due to approaching Severe Cyclonic Storm.",
        fishermen_warning="Total ban on all marine fishing operations and small craft navigation.",
        issued_at="17 Sep 2026, 08:30 IST",
        source="INCOIS / IMD Marine Division"
    ),
    MarineWeatherReport(
        station_or_port="Mumbai Harbour & JNPT",
        state="Maharashtra",
        latitude=18.9500,
        longitude=72.8500,
        wave_height_meters=1.8,
        swell_direction="WSW",
        swell_period_seconds=8.0,
        wind_speed_knots=18,
        wind_direction="WSW",
        sea_state="Moderate",
        visibility_km=6.0,
        coastal_warning=None,
        fishermen_warning="Fishermen advised to be cautious along outer coastal waters.",
        issued_at="17 Sep 2026, 09:00 IST",
        source="INCOIS / IMD Marine Division"
    )
]

DEMO_AVIATION: List[AviationWeatherReport] = [
    AviationWeatherReport(
        airport_icao="VIDP",
        airport_iata="DEL",
        airport_name="Indira Gandhi International Airport",
        city="New Delhi",
        metar_raw="VIDP 170500Z 29008KT 4000 HZ NSC 32/22 Q1008 NOSIG",
        observation_time="17 Sep 2026, 10:30 IST (05:00 UTC)",
        wind_direction_degrees=290,
        wind_speed_knots=8,
        visibility_meters=4000,
        temperature_c=32.0,
        dewpoint_c=22.0,
        altimeter_qnh_hpa=1008,
        flight_category="VFR",
        cloud_ceiling_feet=None,
        clouds_description="No Significant Cloud (NSC)",
        trend="No Significant Change (NOSIG)",
        source="IMD Aviation Meteorological Services"
    ),
    AviationWeatherReport(
        airport_icao="VEBB",
        airport_iata="BBI",
        airport_name="Biju Patnaik International Airport",
        city="Bhubaneswar",
        metar_raw="VEBB 170500Z 06024G38KT 2000 +RA FEW010 BKN020 OVC070 27/26 Q0996 TEMPO 1200 TSRA",
        observation_time="17 Sep 2026, 10:30 IST (05:00 UTC)",
        wind_direction_degrees=60,
        wind_speed_knots=24,
        visibility_meters=2000,
        temperature_c=27.0,
        dewpoint_c=26.0,
        altimeter_qnh_hpa=996,
        flight_category="IFR",
        cloud_ceiling_feet=2000,
        clouds_description="Broken at 2000ft, Overcast at 7000ft with cumulonimbus",
        trend="TEMPO 1200m in Heavy Thunderstorm Rain",
        source="IMD Aviation Meteorological Services"
    )
]


@router.get("/advisories/agriculture", response_model=List[AgriAdvisoryItem])
async def get_agri_advisories(
    state: Optional[str] = Query(None),
    crop: Optional[str] = Query(None)
):
    results = DEMO_AGRI
    if state:
        results = [a for a in results if state.lower() in a.state.lower()]
    if crop:
        results = [a for a in results if crop.lower() in a.crop.lower()]
    return results


@router.get("/marine", response_model=List[MarineWeatherReport])
async def get_marine_weather():
    return DEMO_MARINE


@router.get("/aviation", response_model=List[AviationWeatherReport])
async def get_aviation_weather(airport: Optional[str] = Query(None)):
    if airport:
        return [a for a in DEMO_AVIATION if airport.lower() in a.airport_iata.lower() or airport.lower() in a.airport_icao.lower() or airport.lower() in a.city.lower()]
    return DEMO_AVIATION
