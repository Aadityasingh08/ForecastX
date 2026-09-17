# ForecastX Demo Mode & Verification Scenarios

## Overview
ForecastX operates with `DEMO_MODE=true` by default, allowing full end-to-end evaluation without requiring paid cloud API keys or IMD credentials. All demo datasets are clearly labeled with source attribution and timestamp metadata.

---

## 5 Core Demo Scenarios

### Scenario 1: Rainfall Query for Kanpur
- **User Prompt**: `"Will it rain in Kanpur tomorrow?"`
- **Pipeline Execution**:
  1. Detects `Kanpur`, time `tomorrow`, intent `RAINFALL`.
  2. Queries IMD Chakeri Observatory dataset.
  3. Detects 85% probability of precipitation and Moderate to Heavy Rainfall (25-45 mm) under an active Yellow Alert.
  4. Explains expected rainfall amount, temperature drop (29°C), and waterlogging guidance.
  5. Citations: IMD Forecast, MOSDAC, ECMWF.

### Scenario 2: Cyclone Threat to Odisha
- **User Prompt**: `"Is there any cyclone threat to Odisha?"`
- **Pipeline Execution**:
  1. Detects `Odisha`, intent `CYCLONE`.
  2. Retrieves Bay of Bengal Severe Cyclonic Storm (18.2°N, 88.5°E) with 120 km/h sustained winds.
  3. Displays landfall location (between Puri and Sagar Island, near Dhamra Port on 18 Sep evening).
  4. Details emergency evacuations by OSDMA/NDRF and complete suspension of marine fishing operations.

### Scenario 3: Route Weather Corridor (Delhi to Jaipur)
- **User Prompt**: `"Show me the weather along Delhi to Jaipur route"`
- **Pipeline Execution**:
  1. Interpolates key highway waypoints along NH-48:
     - New Delhi (Departure): 32°C, Haze
     - Gurgaon: 31°C, Partly Cloudy
     - Neemrana: 29°C, Light Showers
     - Kotputli (Adverse Section): 26.5°C, Active Thunderstorm & 28 mm torrential downpours
     - Shahpura: 28°C, Wet Roads
     - Jaipur (Arrival): 30°C, Mostly Cloudy
  2. Highlights the Kotputli stretch as high risk for sudden reduced visibility and surface water accumulation.

### Scenario 4: Natural Hindi Weather Query
- **User Prompt**: `"Explain today's weather in Hindi."` or `"आज का मौसम बताओ"`
- **Pipeline Execution**:
  1. Detects language `hi`.
  2. Synthesizes a natural, fluent Hindi response:
     > *"आज दिल्ली का मौसम: तापमान लगभग 32°C है और वर्तमान स्थिति 'Haze' है। आर्द्रता 62% दर्ज की गई है। भारतीय मौसम विभाग (IMD) के अनुसार आने वाले 24 घंटों में हल्की वर्षा की संभावना है।..."*

### Scenario 5: Multi-Model NWP Comparison
- **User Prompt**: `"Compare ECMWF and GFS for Delhi tomorrow"`
- **Pipeline Execution**:
  1. Detects `Delhi`, date `tomorrow`, intent `MODEL_COMPARISON`.
  2. Retrieves numerical forecasts:
     - IMD NWP: 31.5°C, 4.2 mm rain
     - ECMWF IFS: 30.8°C, 6.8 mm rain
     - NOAA GFS: 32.2°C, 1.5 mm rain
  3. Identifies precipitation variance (ECMWF afternoon convective showers vs GFS dry) without picking an arbitrary "winner".
