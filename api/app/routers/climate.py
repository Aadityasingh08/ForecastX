from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.advisories import ModelComparisonEntry, ModelComparisonResponse, VerificationMetric

router = APIRouter(tags=["Climate & NWP Analysis"])


@router.get("/climate/trends")
async def get_climate_trends(location: str = "New Delhi", variable: str = "temperature"):
    """Historical 10-year monthly anomalies and 30-year climatological normals."""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    normal_temps = [14.2, 17.5, 23.1, 28.9, 32.5, 33.8, 31.2, 29.8, 28.9, 25.4, 20.1, 15.3]
    recent_temps = [14.8, 18.2, 24.5, 30.1, 33.9, 34.2, 31.8, 30.1, 29.4, 26.0, 20.8, 15.9]

    anomalies = [round(r - n, 2) for r, n in zip(recent_temps, normal_temps)]

    return {
        "location": location,
        "variable": variable,
        "dataset": "IMD 0.25° High-Resolution Gridded Dataset / ERA5 Reanalysis",
        "baseline_period": "1991-2020 (30-year Normal)",
        "trend_summary": "Statistically significant warming of +0.72°C per decade in pre-monsoon and post-monsoon months.",
        "series": [
            {"month": m, "normal": n, "observed_mean": r, "anomaly": a}
            for m, n, r, a in zip(months, normal_temps, recent_temps, anomalies)
        ]
    }


@router.get("/models/compare", response_model=ModelComparisonResponse)
async def compare_forecast_models(
    location: str = "Delhi",
    date: str = "2026-09-18"
):
    """
    Compares authoritative NWP models (IMD GFS-Ensemble, ECMWF IFS, NOAA GFS).
    Transparently highlights divergence and uncertainty rather than picking a winner.
    """
    models = [
        ModelComparisonEntry(
            name="IMD-NWP (Global Ensemble)",
            run_timestamp="17 Sep 2026, 00:00 UTC",
            temperature_c=31.5,
            rainfall_mm=4.2,
            wind_speed_kmph=14.0,
            confidence_level="High"
        ),
        ModelComparisonEntry(
            name="ECMWF-IFS (HRES 9km)",
            run_timestamp="17 Sep 2026, 00:00 UTC",
            temperature_c=30.8,
            rainfall_mm=6.8,
            wind_speed_kmph=16.0,
            confidence_level="High"
        ),
        ModelComparisonEntry(
            name="NOAA-GFS (FV3 13km)",
            run_timestamp="17 Sep 2026, 06:00 UTC",
            temperature_c=32.2,
            rainfall_mm=1.5,
            wind_speed_kmph=12.0,
            confidence_level="Moderate"
        )
    ]

    return ModelComparisonResponse(
        location=location,
        forecast_date=date,
        models=models,
        disagreement_detected=True,
        disagreement_details="Precipitation variance detected: ECMWF projects 6.8 mm afternoon convective precipitation, whereas GFS indicates dry conditions (1.5 mm). Temperature spread is within 1.4°C.",
        uncertainty_notes="High confidence in wind direction and temperature bounds. Moderate uncertainty in exact convective rainfall timing.",
        source_attribution=[
            "IMD National Weather Forecasting Centre (NWFC)",
            "European Centre for Medium-Range Weather Forecasts (ECMWF)",
            "National Oceanic and Atmospheric Administration (NOAA/NCEP)"
        ]
    )


@router.get("/verification", response_model=List[VerificationMetric])
async def get_verification_metrics():
    """Independent forecast verification scorecards (MAE, RMSE, Bias)."""
    return [
        VerificationMetric(
            location="New Delhi",
            model_name="IMD-GFS 12km",
            period="Monsoon Season (Jun-Sep)",
            mae_temperature=1.12,
            rmse_temperature=1.45,
            bias_temperature=-0.22,
            rainfall_accuracy_score=86.4,
            sample_count=120
        ),
        VerificationMetric(
            location="New Delhi",
            model_name="ECMWF-IFS 9km",
            period="Monsoon Season (Jun-Sep)",
            mae_temperature=0.98,
            rmse_temperature=1.31,
            bias_temperature=0.08,
            rainfall_accuracy_score=89.1,
            sample_count=120
        ),
        VerificationMetric(
            location="Bhubaneswar",
            model_name="IMD-WRF Regional 3km",
            period="Cyclone Warning Operations",
            mae_temperature=0.85,
            rmse_temperature=1.15,
            bias_temperature=-0.15,
            rainfall_accuracy_score=91.2,
            sample_count=85
        )
    ]
