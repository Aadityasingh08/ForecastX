# FORECASTX
### *Conversational Weather Intelligence for a Safer India* 🇮🇳

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://forecast-x-lake.vercel.app)
[![Deploy to Render](https://img.shields.io/badge/Render-Deploy%20Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/deploy?repo=https://github.com/Aadityasingh08/ForecastX)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900.svg?style=for-the-badge&logo=leaflet)](https://leafletjs.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=for-the-badge&logo=python)](https://python.org)

---

> ### 🌐 **Live Deployments & Cloud Infrastructure**
> - **Frontend (Vercel)**: **[https://forecast-x-lake.vercel.app](https://forecast-x-lake.vercel.app)** (Direct: **[https://forecast-6q8u3o7pn-adi0608.vercel.app](https://forecast-6q8u3o7pn-adi0608.vercel.app)**)  
> - **Backend API (Render)**: **[https://forecastx-backend.onrender.com](https://forecastx-backend.onrender.com)**  
> - **Interactive Swagger Docs**: **[https://forecastx-backend.onrender.com/docs](https://forecastx-backend.onrender.com/docs)**  
> - **API Health Check**: **[https://forecastx-backend.onrender.com/api/health](https://forecastx-backend.onrender.com/api/health)**  
> *Full-stack meteorological intelligence platform deployed across Vercel (Frontend) and Render (Backend).*

---

## 1. Product Vision & Philosophy

**ForecastX** is an authoritative conversational meteorological intelligence platform built to serve the public, disaster management authorities, farmers, mariners, aviation professionals, and state administrators across India.

### Core Architectural Principle
```
┌────────────────────────────────────────────────────────┐
│ Meteorological Data = Authoritative Source of Truth     │
│ GIS Spatial Engine  = Hyperlocal Real-time Context     │
│ Rules Engine        = Safety-Critical Public Decisions │
│ RAG Pipeline        = Domain Knowledge Retrieval       │
│ LLM AI Engine       = Conversational Reasoning & Voice │
│ NWP Physics Models  = IMD GFS, ECMWF IFS, NOAA GFS     │
└────────────────────────────────────────────────────────┘
```
**Zero-Hallucination AI Commitment**: The conversational AI **never invents or guesses weather figures**. Every single output is grounded in structured, authoritative meteorological payloads (IMD, ISRO MOSDAC, ECMWF, WMO) with mandatory source citations and timestamps.

---

## 2. Key Platform Features

### 🗺️ Interactive India Weather GIS Platform
- **Zero-API-Key Architecture**: Seamless OpenStreetMap basemap with instant tile failover.
- **Atmospheric Layer Tabs**:
  - `📡 Live Radar`: Real-time rain swath, cyclone vortex, and interactive AWS station pins.
  - `🌧️ Doppler Rainfall`: Color-coded reflectivity bands (0 to 100+ mm/h).
  - `🌡️ Temperature Heatmap`: Thermal isotherm zones across all Indian climate divisions (18°C Himalayas to 41°C Thar Desert).
  - `💨 Wind Flow Streamlines`: Dynamic directional vectors with velocity tags (15 km/h to 120 km/h Cyclone core).
  - `☁️ Satellite Clouds`: INSAT-3DR infrared convective cloud top simulation.
- **Interactive City Pins & Rich Popups**: Real-time temperature, humidity, wind velocity, and deep-dive forecast links.
- **Basemap Switcher**: Switch between Street, High-Resolution Satellite (ESRI), Terrain (Carto), and Dark Operations modes with one click.
- **Fullscreen GIS Mode**: Expand to full-screen view for emergency operations centers.

### 📍 Live Hyperlocal Geolocation
- Automatic browser GPS coordinate acquisition (`navigator.geolocation`).
- Reverse geocoding endpoint (`/api/locations/reverse`) resolving exact Indian cities, districts, and states.
- Dedicated **"Locate Me"** crosshair on the map that drops a pulsating radar beacon with accuracy metrics (±X meters).

### 🤖 "Ask ForecastX" Conversational AI
- SSE (Server-Sent Events) streaming token generation.
- Grounded prompt synthesis with IMD, ISRO, and ECMWF citations.
- Speech-to-Text (Voice input) and Text-to-Speech (Audio output).
- Multilingual reasoning in English and Hindi (हिंदी).

### 🌪️ Real-Time Cyclone Tracking (Bay of Bengal & Arabian Sea)
- INSAT-3DR satellite eye view with rotating vortex animation.
- Observed vs. Projected forecast cone with landfall waypoint coordinates (e.g. Dhamra Port).
- Storm intensity metrics: Central pressure (984 hPa), sustained winds (120 km/h), translation velocity (NW at 12 km/h).

### 🚨 National CAP Warnings Center
- Common Alerting Protocol (CAP v1.2) compliant alert feeds.
- Filterable by Severity (Severe, High, Moderate, Watch), Hazard type, and State.
- Public evacuation directives and safety advisories.

### 🌾 Sector-Specific Meteorological Intelligence
- **Agrometeorological (Agri)**: State/district crop stages, irrigation directives, and chemical spray alerts.
- **Marine & Ocean**: Sea state, wave height, swell period, port danger signals.
- **Aviation**: METAR and TAF decoding, flight categories (VFR/IFR), cloud ceilings.
- **Climate & Verification**: 10-year monthly anomalies, multi-model comparison (IMD vs ECMWF vs GFS), and RMSE accuracy scorecards.

### 🔐 User Portal & One-Click Role Personas
- Dedicated `/login` portal and popup modal with JWT session issuance.
- **1-Click Demo Profiles**:
  - 👨‍💼 **James Anderson** — Senior IMD Meteorologist (`james@forecastx.gov.in`)
  - 🛡️ **Priya Jena** — Odisha Disaster Operations Lead (`priya.jena@odisha.gov.in`)
  - 🌾 **Dr. R. Sharma** — Punjab Agriculture Officer (`sharma.r@punjabagri.gov.in`)
  - 🚗 **Citizen Traveler** — Citizen User (`traveler@delhi.org`)

---

## 3. Quick Start (Run Locally)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### ⚡ 1-Click Startup (Windows)
Simply double-click:
```bash
start.bat
# or
START_FORECASTX.bat
```
This automatically initializes the FastAPI backend, launches the Vite dev server, and opens `http://localhost:5173` in your default browser!

### 💻 Manual Step-by-Step Launch
```bash
# 1. Setup Backend
python -m venv apps/api/.venv
apps/api/.venv/Scripts/pip install -r apps/api/requirements.txt   # (Windows)
# source apps/api/.venv/bin/activate && pip install -r apps/api/requirements.txt # (macOS/Linux)

# 2. Setup Frontend
cd apps/web
npm install
cd ../..

# 3. Launch Both Simultaneously
python scripts/run_local.py
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 4. Full Production Deployment (Vercel)

ForecastX is natively configured for Vercel deployment:
- **`vercel.json`**: Directs `/api/*` to the Python Serverless ASGI handler and all other routes to the static Vite bundle (`apps/web/dist`).
- **`api/index.py`**: Serverless function entry point exposing FastAPI.

### Deploy to Your Own Vercel Account
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAadityasingh08%2FForecastX)

---

## 5. Docker Deployment

To spin up the containerized architecture with PostGIS, Redis, FastAPI, and Nginx:

```bash
docker-compose up --build
```
| Service | Endpoint |
|---|---|
| Web Frontend | `http://localhost` |
| API Backend | `http://localhost:8000` |
| PostGIS Spatial DB | `localhost:5432` |
| Redis Cache | `localhost:6379` |

---

## 6. Evaluation Scenarios

The platform includes authoritative test datasets ready for verification:

| Scenario | Input Query / Action | Expected Result |
|---|---|---|
| **1. Kanpur Rain** | *"Will it rain in Kanpur tomorrow?"* | Retrieves IMD Chakeri forecast showing 85% probability of moderate-to-heavy rain (25–45 mm) under Yellow Alert. |
| **2. Odisha Cyclone** | *"Is there any cyclone threat to Odisha?"* | Displays active Bay of Bengal Severe Cyclonic Storm (120 km/h) with landfall near Dhamra Port. |
| **3. Highway Route** | *"Show me the weather along Delhi to Jaipur route"* | Analyzes NH-48 corridor and flags severe thunderstorm deterioration at Kotputli stretch. |
| **4. Hindi Query** | *"Explain today's weather in Hindi"* | Generates fluent meteorological analysis in natural Hindi with safety advisory. |
| **5. NWP Comparison** | *"Compare ECMWF and GFS for Delhi tomorrow"* | Displays model divergence table with precipitation differences between ECMWF (6.8 mm) and GFS (1.5 mm). |

---

## 7. Running Automated Tests

Run backend unit tests:
```bash
cd apps/api
.venv/Scripts/python.exe -m pytest tests/ -v
```

Run frontend TypeScript & production build validation:
```bash
cd apps/web
npm run build
```

---

## 8. Deploying Backend on Render

The repository includes a production-ready Render Blueprint [`render.yaml`](render.yaml).

### Option A: 1-Click Blueprint (Recommended)
1. Click the button below:  
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Aadityasingh08/ForecastX)
2. Connect your GitHub account and select repository `ForecastX`.
3. Render automatically reads `render.yaml` and configures the environment, build command, and start command.
4. Click **Apply**. Your FastAPI backend is live in ~2 minutes!

### Option B: Manual Web Service
- **Service Type**: Web Service
- **Repository**: `https://github.com/Aadityasingh08/ForecastX`
- **Root Directory**: `apps/api`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/api/health`

---

## 👨‍💻 Author & Creator
**Made with ❤️ by [Aditya Singh](https://github.com/Aadityasingh08)**

- 🌐 **Live Website**: [https://forecast-fqiy1u941-adi0608.vercel.app](https://forecast-fqiy1u941-adi0608.vercel.app)
- 🐙 **GitHub**: [@Aadityasingh08](https://github.com/Aadityasingh08)
- 💼 **LinkedIn**: [Aditya Singh](https://www.linkedin.com/in/aditya-singh-392b9934b/)
- 📧 **Email**: [adityasingh.as0608@gmail.com](mailto:adityasingh.as0608@gmail.com)

---

## 📜 License & Data Attribution
Built for a Safer, Resilient India 🇮🇳  
Authoritative meteorological feeds and standards: **India Meteorological Department (IMD)**, **ISRO (MOSDAC)**, **WMO (WIS2)**, **ECMWF**, **INCOIS**, and **NOAA**.
