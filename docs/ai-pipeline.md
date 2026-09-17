# ForecastX AI Reasoning Pipeline

## Strict Zero-Hallucination Pipeline
```
User Query
    │
    ▼
1. Intent Detection
    │ (CURRENT_WEATHER, FORECAST, RAINFALL, WARNING, CYCLONE, ROUTE_WEATHER, AGRICULTURE, MARINE, AVIATION, MODEL_COMPARISON)
    ▼
2. Entity & Time Extraction
    │ (Locations, Dates, Crops, Corridors, Language)
    ▼
3. Authoritative Data Retrieval
    │ (Queries IMD, MOSDAC, CAP Alert Engine, Cyclone Tracker)
    ▼
4. Rules Engine & Safety Override
    │ (Prioritizes Active Warnings and Disasters)
    ▼
5. Structured WeatherContext Assembly
    │ (Grounded object containing observations, models, warnings, and source citations)
    ▼
6. Pluggable LLM Generation
    │ (Google Gemini, OpenAI, Local Ollama, or Deterministic Rule-Based Reasoner)
    ▼
7. SSE Streaming & Source Verification
    │ (Progress stages: locating → retrieving → checking warnings → analyzing → generating)
    ▼
Client UI with Clickable Citations & Timestamps
```

## Supported LLM Providers
Configurable via `.env`:
- `LLM_PROVIDER=gemini`: Uses `gemini-1.5-flash` with Google API Key.
- `LLM_PROVIDER=openai`: Uses GPT-4o with OpenAI API Key.
- `LLM_PROVIDER=local`: Connects to local Ollama/vLLM endpoints.
- `LLM_PROVIDER=fallback`: **Deterministic Meteorological Reasoner** (default). Zero cloud API costs required, 100% grounded in WMO/IMD data.
