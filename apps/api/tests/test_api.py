import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["app"] == "ForecastX"


def test_ready():
    res = client.get("/api/ready")
    assert res.status_code == 200
    assert res.json()["status"] == "ready"


def test_weather_strip():
    res = client.get("/api/weather/strip")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) == 4
    names = [c["city_name"] for c in cities]
    assert "New Delhi" in names
    assert "Mumbai" in names
    assert "Chennai" in names
    assert "Kolkata" in names


def test_weather_current_kanpur():
    res = client.get("/api/weather/current?city=Kanpur")
    assert res.status_code == 200
    data = res.json()
    assert data["city_name"] == "Kanpur"
    assert "temperature" in data


def test_warnings():
    res = client.get("/api/weather/warnings")
    assert res.status_code == 200
    warnings = res.json()
    assert len(warnings) > 0
    assert any("Cyclone" in w["hazard"] for w in warnings)


def test_cyclone_tracking():
    res = client.get("/api/cyclones")
    assert res.status_code == 200
    cyclones = res.json()
    assert len(cyclones) >= 1
    assert "Bay of Bengal" in cyclones[0]["basin"]


def test_route_weather():
    payload = {"origin": "Delhi", "destination": "Jaipur"}
    res = client.post("/api/routes/weather", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["checkpoints"]) >= 4
    assert data["has_adverse_weather"] is True


def test_chat_query_kanpur():
    payload = {"message": "Will it rain in Kanpur tomorrow?"}
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "Kanpur" in data["response"]
    assert len(data["sources"]) > 0


def test_chat_query_hindi():
    payload = {"message": "Explain today's weather in Hindi."}
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "hi"
    assert "मौसम" in data["response"]
