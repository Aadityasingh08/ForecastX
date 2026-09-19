export type SeverityLevel = 'Severe' | 'High' | 'Moderate' | 'Watch' | 'Advisory';

export type HazardType =
  | 'Cyclone'
  | 'Heavy Rain'
  | 'Flood'
  | 'Thunderstorm'
  | 'Lightning'
  | 'Heat Wave'
  | 'Cold Wave'
  | 'Dense Fog'
  | 'Strong Wind'
  | 'Coastal Hazard'
  | 'Other';

export interface SourceCitation {
  name: string;
  type: string;
  issued_at: string;
  valid_until?: string;
  model?: string;
  url?: string;
  status: string;
}

export interface CurrentWeather {
  location_id: string;
  city_name: string;
  district: string;
  state: string;
  latitude: float;
  longitude: float;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  condition: string;
  condition_code: string;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  pressure: number;
  visibility: number;
  uv_index?: number;
  rainfall_last_hour?: number;
  observed_at: string;
  source: string;
  is_demo?: boolean;
}

export type float = number;

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  rain_probability?: number | null;
  rainfall_mm: number;
  wind_speed: number;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  condition: string;
  rainfall_summary: string;
  rain_probability?: number | null;
  warning_severity?: string;
}

export interface WeatherForecastResponse {
  location_id: string;
  city_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  source: string;
  issued_at: string;
  model: string;
  is_demo?: boolean;
}

export interface WeatherStation {
  station_id: string;
  station_name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  elevation_meters?: number;
  station_type: string;
  is_active: boolean;
  last_reported_at?: string;
}

export interface RainfallData {
  location_name: string;
  district: string;
  state: string;
  current_intensity_mm_per_hr: number;
  accumulated_24h_mm: number;
  anomaly_percentage?: number;
  status: string;
  last_updated: string;
  source: string;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  district: string;
  state: string;
  country?: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  type: string;
}

export interface CAPWarning {
  id: string;
  source: string;
  hazard: string;
  severity: string;
  urgency: string;
  certainty: string;
  headline: string;
  description: string;
  instruction: string;
  area_desc: string;
  coordinates?: number[][];
  state: string;
  district?: string;
  issued_at: string;
  effective_at: string;
  expires_at: string;
  is_demo?: boolean;
}

export interface CycloneTrackPoint {
  time: string;
  latitude: number;
  longitude: number;
  category: string;
  wind_speed_kmph: number;
  pressure_hpa: number;
  is_forecast: boolean;
}

export interface CycloneData {
  id: string;
  name: string;
  basin: string;
  current_category: string;
  severity: string;
  center_latitude: number;
  center_longitude: number;
  movement_direction: string;
  movement_speed_kmph: number;
  max_sustained_wind_kmph: number;
  estimated_central_pressure_hpa: number;
  expected_landfall_location: string;
  expected_landfall_time: string;
  affected_states: string[];
  track: CycloneTrackPoint[];
  warnings: string[];
  last_updated: string;
  satellite_image_url?: string;
  is_demo?: boolean;
}

export interface RouteWarningInfo {
  severity: string;
  hazard: string;
  message: string;
}

export interface RouteCheckpoint {
  name: string;
  latitude: number;
  longitude: number;
  distance_from_start_km: number;
  estimated_arrival_time: string;
  condition: string;
  temperature: number;
  rainfall_mm: number;
  wind_kmph: number;
  warning?: RouteWarningInfo;
}

export interface RouteWeatherRequest {
  origin: string;
  destination: string;
  departure_time?: string;
}

export interface DepartureWindow {
  departure_time: string;
  offset_hours: number;
  label: string;
  overall_risk: string;
  max_rain_probability: number;
  max_wind_kmph: number;
  advisory: string;
  is_recommended: boolean;
}

export interface RouteWeatherResponse {
  start_location: string;
  destination_location: string;
  total_distance_km: number;
  estimated_duration_hours: number;
  summary: string;
  has_adverse_weather: boolean;
  severe_section_alert?: string;
  highest_risk_segment?: string;
  primary_factor?: string;
  overall_risk?: string;
  route_advisory?: string;
  checkpoints: RouteCheckpoint[];
  departure_windows?: DepartureWindow[];
  recommended_departure?: string;
  sources: SourceCitation[];
  is_demo?: boolean;
}

export interface AgriDecisionResponse {
  location: string;
  latitude: number;
  longitude: number;
  crop: string;
  current_temperature: number;
  current_humidity: number;
  wind_speed_kmph: number;
  rain_probability_next_24h: number;
  expected_rain_mm_next_24h: number;
  spray_window_status: string;
  spray_recommendation: string;
  irrigation_status: string;
  irrigation_recommendation: string;
  harvest_window_status: string;
  harvest_recommendation: string;
  disease_pest_risk: string;
  disease_pest_advisory: string;
  sources: SourceCitation[];
  generated_at: string;
}

export interface EventFeasibilityResponse {
  location: string;
  latitude: number;
  longitude: number;
  event_type: string;
  target_date: string;
  feasibility_score: number;
  grade: string;
  summary: string;
  temperature_c: number;
  rain_probability: number;
  wind_speed_kmph: number;
  uv_index: number;
  limiting_factors: string[];
  best_time_window: string;
  actionable_contingency: string;
  sources: SourceCitation[];
  generated_at: string;
}

export interface RiskAssessmentResult {
  overall_risk: string;
  risk_score: number;
  primary_hazard: string;
  advisory: string;
  action: string;
  rationales: string[];
}

export interface BriefingResponse {
  location: string;
  latitude: number;
  longitude: number;
  issued_at: string;
  current_weather: CurrentWeather;
  risk_assessment: RiskAssessmentResult;
  daily_forecast: DailyForecast[];
  whatsapp_text: string;
  source: string;
}

export interface AgriAdvisoryItem {
  id: string;
  state: string;
  district: string;
  crop: string;
  growth_stage: string;
  current_weather_summary: string;
  official_advisory: string;
  spray_recommendation?: string;
  irrigation_recommendation?: string;
  potential_risks?: string;
  issued_at: string;
  valid_until: string;
  source: string;
}

export interface MarineWeatherReport {
  station_or_port: string;
  state: string;
  latitude: number;
  longitude: number;
  wave_height_meters: number;
  swell_direction: string;
  swell_period_seconds: number;
  wind_speed_knots: number;
  wind_direction: string;
  sea_state: string;
  visibility_km: number;
  coastal_warning?: string;
  fishermen_warning?: string;
  issued_at: string;
  source: string;
}

export interface AviationWeatherReport {
  airport_icao: string;
  airport_iata: string;
  airport_name: string;
  city: string;
  metar_raw: string;
  observation_time: string;
  wind_direction_degrees: number;
  wind_speed_knots: number;
  visibility_meters: number;
  temperature_c: number;
  dewpoint_c: number;
  altimeter_qnh_hpa: number;
  flight_category: string;
  cloud_ceiling_feet?: number;
  clouds_description: string;
  trend: string;
  source: string;
}

export interface ModelComparisonEntry {
  name: string;
  run_timestamp: string;
  temperature_c: number;
  rainfall_mm: number;
  wind_speed_kmph: number;
  confidence_level: string;
}

export interface ModelComparisonResponse {
  location: string;
  forecast_date: string;
  models: ModelComparisonEntry[];
  disagreement_detected: boolean;
  disagreement_details?: string;
  uncertainty_notes: string;
  source_attribution: string[];
}

export interface VerificationMetric {
  location: string;
  model_name: string;
  period: string;
  mae_temperature: number;
  rmse_temperature: number;
  bias_temperature: number;
  rainfall_accuracy_score: number;
  sample_count: number;
}

export interface WeatherContext {
  location: string;
  district?: string;
  state?: string;
  coordinates: { [key: string]: number };
  observation?: CurrentWeather;
  hourly_forecast?: HourlyForecast[];
  daily_forecast?: DailyForecast[];
  warnings: CAPWarning[];
  cyclone_data?: CycloneData | null;
  sources: SourceCitation[];
  geographic_scope: string;
  model: string;
  uncertainty_notes?: string;
  is_demo: boolean;
}

export interface ChatResponse {
  response: string;
  session_id?: string;
  intent: string;
  entities: { [key: string]: any };
  risk_level?: string;
  advisory?: string;
  action?: string;
  weather_context?: WeatherContext;
  sources: SourceCitation[];
  suggested_followups: string[];
  language: string;
}
