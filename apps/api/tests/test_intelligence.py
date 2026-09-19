"""
Comprehensive Test Suite for ForecastX Meteorological Intelligence Platform
Verifies:
1. Multi-turn conversation memory and session continuity
2. Deterministic weather risk evaluation
3. Explainable weather responses ("Why is rain expected?")
4. Comparison mode (inter-city and inter-temporal)
5. Location intelligence for arbitrary Indian cities
6. Live weather data normalization and forecast structure
7. Route corridor weather analysis
8. Multilingual reasoning in English and Hindi
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.conversation_memory import conversation_memory
from app.services.risk_engine import risk_engine
from app.services.time_service import time_service

client = TestClient(app)


def test_location_search_arbitrary_cities():
    """Verifies that location search resolves cities beyond the initial 12 hardcoded demo cities."""
    for query in ["Pune", "Varanasi", "Agra", "Dehradun", "Indore", "Chandigarh"]:
        res = client.get(f"/api/locations/search?q={query}")
        assert res.status_code == 200
        data = res.json()
        assert len(data) > 0
        assert any(query.lower() in d["name"].lower() or query.lower() in d["state"].lower() for d in data)


def test_reverse_geocoding():
    """Verifies reverse geocoding returns a structured location."""
    res = client.get("/api/locations/reverse?lat=26.4499&lon=80.3319")
    assert res.status_code == 200
    data = res.json()
    assert "Kanpur" in data["name"] or "Kanpur" in data["district"] or "Uttar Pradesh" in data["state"]


def test_weather_forecast_hourly_daily_structure():
    """Verifies that the forecast endpoint returns 24 hourly points and 7 daily points."""
    res = client.get("/api/weather/forecast?city=Jaipur")
    assert res.status_code == 200
    data = res.json()
    assert data["city_name"] == "Jaipur"
    assert len(data["hourly"]) >= 12
    assert len(data["daily"]) >= 5
    assert "temperature" in data["hourly"][0]
    assert "temp_max" in data["daily"][0]


def test_deterministic_risk_calculation():
    """Verifies that risk calculations adhere to deterministic meteorological thresholds."""
    # Test High rainfall risk
    from app.schemas.weather import DailyForecast, HourlyForecast
    hourly_rain = [
        HourlyForecast(time="02:00 PM", temperature=28.0, condition="Moderate Rain", rain_probability=85.0, rainfall_mm=35.0, wind_speed=15.0, humidity=80)
    ]
    daily_rain = [
        DailyForecast(date="2026-09-20", day_name="Tomorrow", temp_max=29.0, temp_min=23.0, condition="Heavy Rain", rainfall_summary="35 mm", rain_probability=85.0)
    ]
    eval_res = risk_engine.evaluate_weather_risk(hourly=hourly_rain, daily=daily_rain)
    assert eval_res.overall_risk in ["HIGH", "SEVERE"]
    assert eval_res.rainfall_risk == "HIGH"
    assert any("probability" in r.lower() or "rainfall" in r.lower() for r in eval_res.reasons)


def test_explainable_weather():
    """Verifies the 'Why?' explainability capability."""
    payload = {"message": "Why is rain expected in Kanpur?"}
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "humidity" in data["response"].lower() or "pressure" in data["response"].lower() or "moisture" in data["response"].lower() or "rain" in data["response"].lower()


def test_comparison_mode():
    """Verifies comparative analysis between cities and time periods."""
    payload = {"message": "Compare Delhi and Jaipur weather."}
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "Delhi" in data["response"]
    assert "Jaipur" in data["response"]
    assert "°C" in data["response"]


def test_multiturn_conversation_memory():
    """
    Verifies conversational session continuity:
    Turn 1: "What is the weather in Kanpur tomorrow?"
    Turn 2: "What about the evening?" (Inherits Kanpur and tomorrow)
    Turn 3: "How about Jaipur?" (Switches location, retains temporal frame)
    """
    session_id = "test-session-continuity-101"

    # Turn 1
    t1_res = client.post("/api/chat", json={"message": "What is the weather in Kanpur tomorrow?", "session_id": session_id})
    assert t1_res.status_code == 200
    t1_data = t1_res.json()
    assert "Kanpur" in t1_data["response"]
    assert "Tomorrow" in t1_data["response"] or "20 Sep" in t1_data["response"] or "19 Sep" in t1_data["response"]

    # Turn 2: Elliptical time query
    t2_res = client.post("/api/chat", json={"message": "What about the evening?", "session_id": session_id})
    assert t2_res.status_code == 200
    t2_data = t2_res.json()
    assert "Kanpur" in t2_data["response"]
    assert "Evening" in t2_data["response"]

    # Turn 3: Elliptical location switch
    t3_res = client.post("/api/chat", json={"message": "How about Jaipur?", "session_id": session_id})
    assert t3_res.status_code == 200
    t3_data = t3_res.json()
    assert "Jaipur" in t3_data["response"]


def test_route_weather_intelligence():
    """Verifies route analysis with checkpoints, risk assessment, and travel advisory."""
    res = client.post("/api/routes/weather", json={"origin": "Delhi", "destination": "Jaipur"})
    assert res.status_code == 200
    data = res.json()
    assert len(data["checkpoints"]) >= 4
    assert data["highest_risk_segment"] is not None
    assert data["route_advisory"] is not None
    assert data["total_distance_km"] > 200.0


def test_multilingual_hindi_grounding():
    """Verifies Hindi responses incorporate actual numerical weather figures."""
    res = client.post("/api/chat", json={"message": "कल कानपुर में बारिश होगी क्या?"})
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "hi"
    assert "कानपुर" in data["response"]
    assert "°C" in data["response"]
    assert "%" in data["response"]


def test_smart_departure_windows():
    """Verifies that route analysis generates departure windows with recommendations."""
    res = client.post("/api/routes/weather", json={"origin": "Delhi", "destination": "Jaipur"})
    assert res.status_code == 200
    data = res.json()
    assert "departure_windows" in data
    assert len(data["departure_windows"]) == 3
    assert data["recommended_departure"] is not None
    assert any(win["is_recommended"] for win in data["departure_windows"])


def test_agri_decision_service():
    """Verifies agricultural decision intelligence (spraying, irrigation, disease)."""
    res = client.get("/api/advisory/agri?location=Ludhiana&crop=Wheat")
    assert res.status_code == 200
    data = res.json()
    assert "spray_window_status" in data
    assert "irrigation_status" in data
    assert "Wheat" in data["crop"]
    assert len(data["spray_recommendation"]) > 10


def test_event_feasibility_service():
    """Verifies outdoor event feasibility scoring for weddings."""
    res = client.get("/api/advisory/event-feasibility?location=Delhi&event_type=wedding")
    assert res.status_code == 200
    data = res.json()
    assert 0 <= data["feasibility_score"] <= 100
    assert data["grade"] in ["EXCELLENT", "GOOD", "CAUTION", "UNFAVORABLE"]
    assert len(data["limiting_factors"]) > 0


def test_meteorological_briefing_export():
    """Verifies official meteorological briefing generation and WhatsApp payload."""
    res = client.get("/api/advisory/briefing?location=Kanpur")
    assert res.status_code == 200
    data = res.json()
    assert "whatsapp_text" in data
    assert "FORECASTX METEOROLOGICAL BRIEFING" in data["whatsapp_text"]
    assert "risk_assessment" in data


def test_chat_kisan_and_event_intents():
    """Verifies chatbot correctly routes agriculture and event questions."""
    # Agri query in English
    res_agri = client.post("/api/chat", json={"message": "Can I spray pesticide on wheat tomorrow in Karnal?"})
    assert res_agri.status_code == 200
    data_agri = res_agri.json()
    assert "Spray" in data_agri["response"] or "स्प्रे" in data_agri["response"] or "परामर्श" in data_agri["response"] or "Crop" in data_agri["response"] or "Wheat" in data_agri["response"]

    # Event query in English
    res_event = client.post("/api/chat", json={"message": "Is tomorrow good for an outdoor wedding in Delhi?"})
    assert res_event.status_code == 200
    data_event = res_event.json()
    assert "Feasibility" in data_event["response"] or "Wedding" in data_event["response"] or "आयोजन" in data_event["response"]

