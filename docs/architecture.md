# ForecastX Architecture Document

## Overview
**ForecastX** is an authoritative meteorological intelligence platform engineered specifically for the Indian subcontinent. It bridges authoritative hydro-meteorological data feeds (IMD, ISRO MOSDAC, ECMWF, WMO) with spatial GIS calculations and an authoritative conversational AI reasoning engine.

## Core Architectural Principle
```
Meteorological Data = Source of Truth
GIS                 = Spatial Intelligence
Rules Engine        = Safety-Critical Decisions
RAG                 = Contextual Knowledge
LLM                 = Conversational Interface / Reasoning
NWP                 = Forecast Physics
```

The conversational agent NEVER hallucinates weather values. Every statement is deterministically grounded in structured `WeatherContext`.

---

## Monorepo Layout
- `apps/web`: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Leaflet, Recharts.
- `apps/api`: Python FastAPI backend with Pydantic v2 schemas and pluggable weather providers.
- `packages/shared-types`: Unified TypeScript definitions shared across the monorepo.
- `data/`: Curated Indian meteorological datasets and station registers.
- `docker/`: Multi-stage Dockerfiles for web and api, plus `docker-compose.yml` with PostgreSQL/PostGIS and Redis.
- `scripts/`: Automated launch scripts for local development.

---

## Data Priority Hierarchy
When resolving weather information:
1. **Official IMD Warning (CAP Alert)**
2. **Official IMD Forecast**
3. **Official In-Situ Observation (AWS / Synoptic)**
4. **Authoritative NWP (IMD-GFS Ensemble / ECMWF-IFS)**
5. **Research / Open Model (NOAA-GFS)**
6. **Commercial Fallback**

If models diverge, ForecastX displays **"Model Disagreement Detected"** with variance metrics rather than fabricating certainty.
