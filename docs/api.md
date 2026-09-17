# ForecastX API Specification

Base URL: `http://localhost:8000/api`
Interactive Swagger Docs: `http://localhost:8000/docs`

## 1. System Health & Probes
- `GET /api/health`: Returns API status, version, and active LLM provider.
- `GET /api/ready`: Readiness probe verifying database and GIS engine connectivity.

## 2. Weather Endpoints
- `GET /api/weather/current`: Real-time weather observation for coordinates or city name.
- `GET /api/weather/strip`: Returns the 4 flagship dashboard cities (New Delhi, Mumbai, Chennai, Kolkata).
- `GET /api/weather/forecast`: Comprehensive 24h hourly and 7-day daily forecast.
- `GET /api/weather/hourly`: Detailed hourly temperature, precipitation probability, and wind.
- `GET /api/weather/daily`: Multi-day outlook with warnings and rainfall summaries.
- `GET /api/weather/rainfall`: Automatic Weather Station (AWS) precipitation totals and anomaly percentages.
- `GET /api/weather/stations`: Active weather observation station metadata.
- `GET /api/weather/warnings`: All active CAP warnings.

## 3. Alerts & Cyclones
- `GET /api/warnings`: CAP warnings filtered by `hazard`, `severity`, or `state`.
- `GET /api/warnings/{id}`: Detailed bulletin with protective instructions.
- `GET /api/cyclones`: Active tropical cyclones in Bay of Bengal and Arabian Sea.
- `GET /api/cyclones/{id}`: Trajectory waypoints, central pressure, wind radii, and landfall projection.

## 4. AI & Conversational Reasoning
- `POST /api/chat`: Synchronous conversational reasoning with structured context and citations.
- `POST /api/chat/stream`: Server-Sent Events (SSE) streaming pipeline progress stages and grounded tokens.

## 5. Corridors & Spatial Operations
- `POST /api/routes/weather`: Multi-checkpoint weather and hazard intersection analysis along highways (e.g. NH-48 Delhi → Jaipur).
- `GET /api/locations/search`: Auto-complete and geocoding for cities, districts, pincodes, or lat/lon coordinates.

## 6. Specialized Domains
- `GET /api/advisories/agriculture`: Gramin Krishi Mausam Seva crop advisories.
- `GET /api/marine`: Wave height, swell, and port danger signals.
- `GET /api/aviation`: METAR/TAF decoded flight categories.
- `GET /api/climate/trends`: 10-year anomalies against 30-year normals.
- `GET /api/models/compare`: Multi-model NWP comparison (IMD, ECMWF, GFS).
- `GET /api/verification`: Independent forecast verification metrics (MAE, RMSE, Bias).
