"""
Deterministic Weather Intelligence & Risk Engine
Calculates safety-critical meteorological hazards, risk levels (LOW, MODERATE, HIGH, SEVERE),
transparent rationales, actionable public advisories, and explainable weather dynamics.
Ensures zero AI hallucination for critical safety parameters.
"""
from typing import Any, Dict, List, Optional, Tuple
from app.schemas.weather import CurrentWeather, DailyForecast, HourlyForecast


class WeatherRiskAssessment:
    def __init__(
        self,
        overall_risk: str,
        risk_score: float,
        rainfall_risk: str,
        heat_risk: str,
        wind_risk: str,
        storm_risk: str,
        visibility_risk: str,
        primary_hazard: Optional[str],
        reasons: List[str],
        advisory: str,
        action: str,
    ):
        self.overall_risk = overall_risk      # LOW, MODERATE, HIGH, SEVERE
        self.risk_score = risk_score          # 0.0 to 10.0
        self.rainfall_risk = rainfall_risk
        self.heat_risk = heat_risk
        self.wind_risk = wind_risk
        self.storm_risk = storm_risk
        self.visibility_risk = visibility_risk
        self.primary_hazard = primary_hazard
        self.reasons = reasons
        self.advisory = advisory
        self.action = action

    def to_dict(self) -> Dict[str, Any]:
        return {
            "overall_risk": self.overall_risk,
            "risk_score": self.risk_score,
            "rainfall_risk": self.rainfall_risk,
            "heat_risk": self.heat_risk,
            "wind_risk": self.wind_risk,
            "storm_risk": self.storm_risk,
            "visibility_risk": self.visibility_risk,
            "primary_hazard": self.primary_hazard,
            "reasons": self.reasons,
            "advisory": self.advisory,
            "action": self.action,
        }


class WeatherIntelligenceEngine:
    """Deterministic, transparent meteorological analysis engine."""

    # Configurable safety-critical thresholds
    THRESHOLDS = {
        "rain_prob_high": 75.0,        # %
        "rain_prob_mod": 50.0,         # %
        "rain_mm_heavy": 30.0,         # mm / 24h
        "rain_mm_moderate": 10.0,      # mm / 24h
        "temp_extreme_heat": 44.0,     # °C
        "temp_high_heat": 40.0,        # °C
        "temp_severe_cold": 4.0,       # °C
        "wind_severe": 65.0,           # km/h
        "wind_high": 40.0,             # km/h
        "wind_moderate": 25.0,         # km/h
        "visibility_poor": 1.5,        # km
        "visibility_moderate": 4.0,    # km
    }

    @classmethod
    def evaluate_weather_risk(
        cls,
        obs: Optional[CurrentWeather] = None,
        hourly: Optional[List[HourlyForecast]] = None,
        daily: Optional[List[DailyForecast]] = None,
        target_hour_range: Optional[Tuple[int, int]] = None
    ) -> WeatherRiskAssessment:
        """
        Evaluates risk deterministically from current observations and forecast slices.
        """
        reasons: List[str] = []
        hazard_scores: Dict[str, float] = {
            "Rainfall": 0.0,
            "Heat": 0.0,
            "Wind": 0.0,
            "Storm": 0.0,
            "Visibility": 0.0,
        }

        # 1. Evaluate Rainfall & Storm Risk
        max_rain_prob = 0.0
        total_rain_mm = 0.0
        has_thunderstorm = False

        if obs and ("rain" in obs.condition.lower() or "thunder" in obs.condition.lower()):
            if "thunder" in obs.condition.lower():
                hazard_scores["Storm"] = max(hazard_scores["Storm"], 6.0)
                reasons.append(f"Active thunderstorm observed ({obs.condition}) with convective cloud activity.")
            if obs.rainfall_last_hour and obs.rainfall_last_hour > 5.0:
                hazard_scores["Rainfall"] = max(hazard_scores["Rainfall"], 5.0)
                reasons.append(f"Active rainfall recorded at {obs.rainfall_last_hour} mm/h.")

        if hourly:
            for idx, h in enumerate(hourly):
                if target_hour_range and not (target_hour_range[0] <= idx <= target_hour_range[1]):
                    continue
                if h.rain_probability and h.rain_probability > max_rain_prob:
                    max_rain_prob = h.rain_probability
                total_rain_mm += h.rainfall_mm
                if "thunder" in h.condition.lower():
                    has_thunderstorm = True

        if daily and len(daily) > 0:
            target_d = daily[0]
            if target_d.rain_probability and target_d.rain_probability > max_rain_prob:
                max_rain_prob = target_d.rain_probability
            if "thunder" in target_d.condition.lower():
                has_thunderstorm = True

        # Rainfall categorization
        if max_rain_prob >= cls.THRESHOLDS["rain_prob_high"] and total_rain_mm >= cls.THRESHOLDS["rain_mm_heavy"]:
            rainfall_risk = "HIGH"
            hazard_scores["Rainfall"] = 8.0
            reasons.append(f"Elevated rainfall probability ({max_rain_prob:.0f}%) with expected accumulation of {total_rain_mm:.1f} mm.")
        elif max_rain_prob >= cls.THRESHOLDS["rain_prob_mod"] or total_rain_mm >= cls.THRESHOLDS["rain_mm_moderate"]:
            rainfall_risk = "MODERATE"
            hazard_scores["Rainfall"] = 5.0
            reasons.append(f"Moderate chance of precipitation ({max_rain_prob:.0f}%) with expected accumulation of {total_rain_mm:.1f} mm.")
        elif max_rain_prob >= 25.0:
            rainfall_risk = "LOW"
            hazard_scores["Rainfall"] = 2.0
        else:
            rainfall_risk = "LOW"
            hazard_scores["Rainfall"] = 0.5

        if has_thunderstorm:
            storm_risk = "HIGH" if max_rain_prob >= 60 else "MODERATE"
            hazard_scores["Storm"] = max(hazard_scores["Storm"], 7.0 if storm_risk == "HIGH" else 4.5)
            reasons.append("Atmospheric instability detected with convective thunderstorm potential.")
        else:
            storm_risk = "LOW"

        # 2. Evaluate Heat & Cold Risk
        curr_temp = obs.temperature if obs else (hourly[0].temperature if hourly else 30.0)
        curr_feels = obs.feels_like if obs else curr_temp
        if curr_temp >= cls.THRESHOLDS["temp_extreme_heat"] or curr_feels >= 46.0:
            heat_risk = "SEVERE"
            hazard_scores["Heat"] = 9.0
            reasons.append(f"Extreme heat stress: Ambient temperature {curr_temp:.1f}°C (feels like {curr_feels:.1f}°C).")
        elif curr_temp >= cls.THRESHOLDS["temp_high_heat"] or curr_feels >= 42.0:
            heat_risk = "HIGH"
            hazard_scores["Heat"] = 7.0
            reasons.append(f"High heat hazard: Ambient temperature {curr_temp:.1f}°C exceeding health caution threshold.")
        elif curr_temp >= 36.0:
            heat_risk = "MODERATE"
            hazard_scores["Heat"] = 4.0
        else:
            heat_risk = "LOW"
            hazard_scores["Heat"] = 1.0

        # 3. Evaluate Wind Risk
        curr_wind = obs.wind_speed if obs else (hourly[0].wind_speed if hourly else 12.0)
        if curr_wind >= cls.THRESHOLDS["wind_severe"]:
            wind_risk = "SEVERE"
            hazard_scores["Wind"] = 9.0
            reasons.append(f"Gale-force surface winds reaching {curr_wind:.1f} km/h.")
        elif curr_wind >= cls.THRESHOLDS["wind_high"]:
            wind_risk = "HIGH"
            hazard_scores["Wind"] = 7.0
            reasons.append(f"Strong gusty winds measured at {curr_wind:.1f} km/h.")
        elif curr_wind >= cls.THRESHOLDS["wind_moderate"]:
            wind_risk = "MODERATE"
            hazard_scores["Wind"] = 4.0
            reasons.append(f"Moderate surface breeze at {curr_wind:.1f} km/h.")
        else:
            wind_risk = "LOW"
            hazard_scores["Wind"] = 1.0

        # 4. Evaluate Visibility Risk
        curr_vis = obs.visibility if obs else 8.0
        if curr_vis <= cls.THRESHOLDS["visibility_poor"]:
            visibility_risk = "HIGH"
            hazard_scores["Visibility"] = 7.5
            reasons.append(f"Poor atmospheric visibility ({curr_vis:.1f} km) due to fog, mist, or dense suspended particles.")
        elif curr_vis <= cls.THRESHOLDS["visibility_moderate"]:
            visibility_risk = "MODERATE"
            hazard_scores["Visibility"] = 4.0
        else:
            visibility_risk = "LOW"
            hazard_scores["Visibility"] = 0.5

        # 5. Composite Risk Calculation
        primary_hazard = max(hazard_scores, key=hazard_scores.get)
        top_score = hazard_scores[primary_hazard]

        if top_score >= 8.5:
            overall_risk = "SEVERE"
        elif top_score >= 6.5:
            overall_risk = "HIGH"
        elif top_score >= 3.5:
            overall_risk = "MODERATE"
        else:
            overall_risk = "LOW"

        # 6. Generate Contextual Advisory & Action
        if not reasons:
            reasons.append("Weather parameters reside comfortably within normal seasonal safety thresholds.")

        if overall_risk in ["SEVERE", "HIGH"]:
            if primary_hazard == "Rainfall" or primary_hazard == "Storm":
                advisory = f"High probability of heavy precipitation ({total_rain_mm:.0f} mm) and localized waterlogging."
                action = "Carry sturdy rain protection, allow extra travel time, and avoid waterlogged underpasses."
            elif primary_hazard == "Heat":
                advisory = f"High heat stress warning with temperatures hovering around {curr_temp:.0f}°C."
                action = "Limit direct outdoor sun exposure between 12:00 and 16:00, stay hydrated, and wear light cotton."
            elif primary_hazard == "Wind":
                advisory = f"Strong wind gusts up to {curr_wind:.0f} km/h may dislodge unfastened structures and tree branches."
                action = "Secure outdoor items and exercise caution while driving two-wheelers on elevated corridors."
            else:
                advisory = "Adverse weather conditions detected across the forecast period."
                action = "Monitor local weather bulletins and take necessary safety precautions."
        elif overall_risk == "MODERATE":
            if primary_hazard == "Rainfall":
                advisory = "Scattered showers likely during the forecast period."
                action = "Keep an umbrella handy and check local roadway updates before commuting."
            elif primary_hazard == "Heat":
                advisory = "Warm afternoon conditions with moderate humidity."
                action = "Maintain regular hydration during afternoon peak hours."
            else:
                advisory = "Weather is generally manageable with isolated passing fluctuations."
                action = "Proceed with routine activities while checking periodic updates."
        else:
            advisory = "Favorable and benign meteorological conditions prevailing."
            action = "Ideal conditions for travel, outdoor activities, and agricultural work."

        return WeatherRiskAssessment(
            overall_risk=overall_risk,
            risk_score=top_score,
            rainfall_risk=rainfall_risk,
            heat_risk=heat_risk,
            wind_risk=wind_risk,
            storm_risk=storm_risk,
            visibility_risk=visibility_risk,
            primary_hazard=primary_hazard if top_score >= 3.5 else None,
            reasons=reasons,
            advisory=advisory,
            action=action,
        )

    @classmethod
    def explain_weather_phenomenon(
        cls,
        question_topic: str,
        obs: CurrentWeather,
        hourly: Optional[List[HourlyForecast]] = None
    ) -> str:
        """
        Generates grounded, physically accurate explanations for 'Why?' inquiries.
        """
        q = question_topic.lower()

        if "rain" in q or "precipitation" in q or "बारिश" in q:
            reasons = []
            if obs.humidity >= 70:
                reasons.append(f"Elevated atmospheric relative humidity ({obs.humidity}%), indicating near-saturation.")
            if obs.pressure <= 1008.0:
                reasons.append(f"Relatively low surface barometric pressure ({obs.pressure} hPa), encouraging convective updrafts.")
            if hourly and any(h.rain_probability and h.rain_probability >= 50 for h in hourly[:12]):
                max_p = max(h.rain_probability for h in hourly[:12] if h.rain_probability)
                reasons.append(f"High model precipitation probability reaching {max_p:.0f}% in upcoming hours.")

            if not reasons:
                reasons.append("Marginal moisture advection along regional surface wind trajectories.")

            explanation = (
                "🌧️ Scientific Explanation for Expected Rainfall:\n\n"
                + "\n".join(f"• {r}" for r in reasons)
                + "\n\nThese combined moisture, pressure, and thermal dynamics favor cloud condensation and precipitation."
            )
            return explanation

        if "hot" in q or "heat" in q or "temperature" in q or "warm" in q or "गर्मी" in q or "तापमान" in q:
            reasons = []
            if obs.temperature >= 32.0:
                reasons.append(f"Current maximum solar insolation with ambient temperature at {obs.temperature}°C.")
            if obs.humidity >= 60:
                reasons.append(f"High humidity ({obs.humidity}%) suppressing evaporative cooling, elevating 'feels like' to {obs.feels_like}°C.")
            if "clear" in obs.condition.lower():
                reasons.append("Minimal cloud cover allowing direct solar radiation to heat the ground surface.")

            if not reasons:
                reasons.append("Seasonal thermal baseline characteristic of this climate zone.")

            return (
                "🌡️ Explanation for Temperature Conditions:\n\n"
                + "\n".join(f"• {r}" for r in reasons)
                + f"\n\nSurface wind from {obs.wind_direction} at {obs.wind_speed} km/h provides modest air circulation."
            )

        return (
            f"Meteorological analysis for {obs.city_name}: "
            f"Conditions are characterized by temperature of {obs.temperature}°C, {obs.humidity}% relative humidity, "
            f"and surface pressure of {obs.pressure} hPa under {obs.condition}."
        )

    @classmethod
    def compare_weather_entities(
        cls,
        target_a_name: str,
        weather_a: Dict[str, Any],
        target_b_name: str,
        weather_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Performs a quantitative and qualitative comparison between two weather entities
        (e.g., Today vs. Tomorrow or City A vs. City B).
        """
        temp_a = weather_a.get("temperature", 30.0)
        temp_b = weather_b.get("temperature", 30.0)
        temp_diff = round(temp_b - temp_a, 1)

        rain_a = weather_a.get("rain_prob", 0.0)
        rain_b = weather_b.get("rain_prob", 0.0)
        rain_diff = round(rain_b - rain_a, 1)

        cond_a = weather_a.get("condition", "Partly Cloudy")
        cond_b = weather_b.get("condition", "Partly Cloudy")

        # Formulate grounded comparison narrative
        narrative_parts = []
        if abs(temp_diff) < 1.0:
            narrative_parts.append(f"{target_b_name} will have similar temperatures to {target_a_name} ({temp_b}°C vs {temp_a}°C).")
        elif temp_diff > 0:
            narrative_parts.append(f"{target_b_name} is expected to be warmer by {temp_diff}°C ({temp_b}°C vs {temp_a}°C).")
        else:
            narrative_parts.append(f"{target_b_name} is expected to be cooler by {abs(temp_diff)}°C ({temp_b}°C vs {temp_a}°C).")

        if abs(rain_diff) >= 20.0:
            if rain_diff > 0:
                narrative_parts.append(f"Precipitation probability is notably higher in {target_b_name} ({rain_b:.0f}% vs {rain_a:.0f}%).")
            else:
                narrative_parts.append(f"Precipitation probability drops substantially in {target_b_name} ({rain_b:.0f}% vs {rain_a:.0f}%).")
        else:
            narrative_parts.append(f"Rain chances remain comparable ({rain_b:.0f}% vs {rain_a:.0f}%).")

        summary = " ".join(narrative_parts)

        return {
            "entity_a": {"name": target_a_name, "temp": temp_a, "rain_prob": rain_a, "condition": cond_a},
            "entity_b": {"name": target_b_name, "temp": temp_b, "rain_prob": rain_b, "condition": cond_b},
            "temp_difference": temp_diff,
            "rain_prob_difference": rain_diff,
            "summary": summary,
        }


risk_engine = WeatherIntelligenceEngine()
