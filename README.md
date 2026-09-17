# FORECASTX
### *Conversational Weather Intelligence for a Safer India*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900.svg?logo=leaflet)](https://leafletjs.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python)](https://python.org)

---

## 1. Product Vision
**ForecastX** is an authoritative conversational meteorological intelligence platform built to serve the public, disaster response teams, farmers, mariners, aviation professionals, and government agencies across India.

### Core Architecture Principle:
```
Meteorological Data = Source of Truth
GIS                 = Spatial Intelligence
Rules Engine        = Safety-Critical Decisions
RAG                 = Contextual Knowledge
LLM                 = Conversational Interface & Reasoning
NWP                 = Forecast Physics
```
The conversational LLM **never invents weather data**. ForecastX queries authoritative meteorological structures first (IMD, MOSDAC, ECMWF, WMO) and then uses AI to explain the conditions clearly with mandatory source citations and timestamps.

---

## 2. Quick Start (Run Locally)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

### Instant Local Launch
Clone the repository and run:

```bash
# 1. Setup Python Virtualenv & Install Dependencies
python -m venv apps/api/.venv
apps/api/.venv/Scripts/pip install -r apps/api/requirements.txt   # (On Windows)
# source apps/api/.venv/bin/activate && pip install -r apps/api/requirements.txt # (On Linux/macOS)

# 2. Install Web Dependencies
cd apps/web
npm install
cd ../..

# 3. Launch Both Backend & Frontend with One Command
python scripts/run_local.py
# Or on Windows simply double-click: scripts\start.bat
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 3. Docker Deployment

To launch the full production container stack with PostgreSQL, PostGIS, Redis, FastAPI, and Nginx:

```bash
docker-compose up --build
```
- Web UI: `http://localhost`
- API Backend: `http://localhost:8000`
- PostGIS: `localhost:5432`
- Redis: `localhost:6379`

---

## 4. Key Features

1. **Dashboard UI**: Pixel-accurate implementation of the official ForecastX dashboard with:
   - Flagship city cards: New Delhi, Mumbai, Chennai, Kolkata.
   - Interactive Leaflet weather map with rainfall intensity legend, active layers panel, and cyclone eye vortex in the Bay of Bengal.
   - **Ask ForecastX** AI chat panel with SSE streaming tokens, voice input, image upload, and clickable source citations.
   - Active CAP warnings, Cyclone tracking, and Quick Access cards.
2. **Interactive Weather Map**:
   - Dynamic layers: Live Weather, Rainfall, Temperature, Wind, Cloud Cover, District Boundaries.
   - Cyclone tracking: Real-time center coordinates, observed and forecast cones, storm category.
3. **Weather Search & Deep Dive**:
   - Location resolution by city, district, pincode (e.g. 208001), or coordinates (`28.61, 77.20`).
   - 24-hour Recharts temperature & rainfall charts, 7-day outlook.
4. **National CAP Warnings Center**:
   - Common Alerting Protocol (CAP v1.2) warnings filterable by severity (Severe, High, Moderate, Watch), hazard, and state.
   - Official public safety and evacuation instructions.
5. **Bay of Bengal & Arabian Sea Cyclone Tracking**:
   - Satellite eye view (INSAT-3DR Rapid Scan).
   - Sustained wind speeds (120 km/h), central pressure (984 hPa), translation speed (NW at 12 km/h).
   - Trajectory table with waypoints and landfall projection.
6. **Corridor Route Weather**:
   - New Delhi → Jaipur (NH-48) with highway weather checkpoints and warning section detection (Kotputli rain & thunderstorm).
7. **Specialized Sectors**:
   - **Gramin Krishi Mausam Seva (Agri)**: State/district crop growth stages, spraying directives, and irrigation advisories.
   - **Marine & Ocean Services**: Wave heights, swell period, sea state, port danger signals.
   - **Aviation**: METAR/TAF raw and decoded flight categories (VFR/IFR), cloud ceilings, and altimeters.
   - **Climate & Verification**: 10-year monthly anomalies, multi-model NWP comparison (IMD vs ECMWF vs GFS), and MAE/RMSE scorecards.
8. **Multilingual & Voice**:
   - English, Hindi (हिंदी), and Indian languages.
   - Speech-to-Text and Text-to-Speech audio synthesis.

---

## 5. Demo Scenarios (`DEMO_MODE=true`)

The application comes pre-loaded with realistic, authoritative Indian meteorological datasets:

- **Scenario 1**: Click or type: `"Will it rain in Kanpur tomorrow?"`
  - *Retrieves IMD Chakeri forecast showing 85% probability of moderate-to-heavy rain (25-45 mm) under Yellow Alert.*
- **Scenario 2**: Click or type: `"Is there any cyclone threat to Odisha?"`
  - *Displays active Bay of Bengal Severe Cyclonic Storm, 120 km/h winds, and landfall near Dhamra Port.*
- **Scenario 3**: Click or type: `"Show me the weather along Delhi to Jaipur route"`
  - *Analyzes NH-48 corridor and flags severe thunderstorm deterioration at Kotputli.*
- **Scenario 4**: Click or type: `"Explain today's weather in Hindi."`
  - *Generates fluent meteorological explanation in Hindi.*
- **Scenario 5**: Click or type: `"Compare ECMWF and GFS for Delhi tomorrow"`
  - *Shows multi-model comparison table highlighting precipitation divergence.*

---

## 6. Running Automated Tests

Run the backend test suite:
```bash
cd apps/api
.venv/Scripts/python.exe -m pytest tests/ -v
```

Run the frontend TypeScript & production build check:
```bash
cd apps/web
npm run build
```

---

## 7. License & Attribution
- Built for a Safer, Resilient India 🇮🇳
- Data sources: India Meteorological Department (IMD), ISRO (MOSDAC), WMO, ECMWF, INCOIS, NOAA.

---

## 👨‍💻 Author & Creator
**Made with ❤️ by [Aditya Singh](https://github.com/Aadityasingh08)**

- **GitHub**: [@Aadityasingh08](https://github.com/Aadityasingh08)
- **LinkedIn**: [Aditya Singh](https://www.linkedin.com/in/aditya-singh-392b9934b/)
- **Email**: [adityasingh.as0608@gmail.com](mailto:adityasingh.as0608@gmail.com)

