import {
  CurrentWeather,
  WeatherForecastResponse,
  CAPWarning,
  CycloneData,
  RouteWeatherResponse,
  RouteWeatherRequest,
  AgriAdvisoryItem,
  AgriDecisionResponse,
  EventFeasibilityResponse,
  BriefingResponse,
  MarineWeatherReport,
  AviationWeatherReport,
  ModelComparisonResponse,
  VerificationMetric,
  LocationSearchResult,
  ChatResponse,
  SourceCitation
} from '@/types';

const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const clean = envUrl.replace(/\/$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  return '/api';
};

const API_BASE = getApiBase();

export async function fetchTopCitiesStrip(): Promise<CurrentWeather[]> {
  const res = await fetch(`${API_BASE}/weather/strip`);
  if (!res.ok) throw new Error('Failed to fetch top cities');
  return res.json();
}

export async function fetchCurrentWeather(city?: string, lat?: number, lon?: number): Promise<CurrentWeather> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (lat !== undefined) params.set('lat', lat.toString());
  if (lon !== undefined) params.set('lon', lon.toString());
  const res = await fetch(`${API_BASE}/weather/current?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch current weather');
  return res.json();
}

export async function fetchForecast(city?: string, lat?: number, lon?: number): Promise<WeatherForecastResponse> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (lat !== undefined) params.set('lat', lat.toString());
  if (lon !== undefined) params.set('lon', lon.toString());
  const res = await fetch(`${API_BASE}/weather/forecast?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch weather forecast');
  return res.json();
}

export async function fetchActiveWarnings(hazard?: string, severity?: string, state?: string): Promise<CAPWarning[]> {
  const params = new URLSearchParams();
  if (hazard) params.set('hazard', hazard);
  if (severity) params.set('severity', severity);
  if (state) params.set('state', state);
  const res = await fetch(`${API_BASE}/weather/warnings?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch warnings');
  return res.json();
}

export async function fetchCyclones(): Promise<CycloneData[]> {
  const res = await fetch(`${API_BASE}/cyclones`);
  if (!res.ok) throw new Error('Failed to fetch cyclones');
  return res.json();
}

export async function fetchRouteWeather(origin: string, destination: string): Promise<RouteWeatherResponse> {
  const res = await fetch(`${API_BASE}/routes/weather`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error('Failed to analyze route weather');
  return res.json();
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const res = await fetch(`${API_BASE}/locations/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search locations');
  return res.json();
}

export async function fetchAgriAdvisories(state?: string, crop?: string): Promise<AgriAdvisoryItem[]> {
  const params = new URLSearchParams();
  if (state) params.set('state', state);
  if (crop) params.set('crop', crop);
  const res = await fetch(`${API_BASE}/advisories/agriculture?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch agricultural advisories');
  return res.json();
}

export async function fetchAgriDecision(location: string, crop: string = 'Wheat'): Promise<AgriDecisionResponse> {
  const res = await fetch(`${API_BASE}/advisory/agri?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error('Failed to fetch agricultural decision intelligence');
  return res.json();
}

export async function fetchEventFeasibility(location: string, eventType: string = 'wedding', daysAhead: number = 0): Promise<EventFeasibilityResponse> {
  const res = await fetch(`${API_BASE}/advisory/event-feasibility?location=${encodeURIComponent(location)}&event_type=${encodeURIComponent(eventType)}&days_ahead=${daysAhead}`);
  if (!res.ok) throw new Error('Failed to evaluate event feasibility');
  return res.json();
}

export async function fetchBriefing(location: string): Promise<BriefingResponse> {
  const res = await fetch(`${API_BASE}/advisory/briefing?location=${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error('Failed to generate meteorological briefing');
  return res.json();
}

export async function fetchMarineWeather(): Promise<MarineWeatherReport[]> {
  const res = await fetch(`${API_BASE}/marine`);
  if (!res.ok) throw new Error('Failed to fetch marine reports');
  return res.json();
}

export async function fetchAviationWeather(airport?: string): Promise<AviationWeatherReport[]> {
  const params = new URLSearchParams();
  if (airport) params.set('airport', airport);
  const res = await fetch(`${API_BASE}/aviation?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch aviation weather');
  return res.json();
}

export async function fetchModelComparison(location: string = 'Delhi'): Promise<ModelComparisonResponse> {
  const res = await fetch(`${API_BASE}/models/compare?location=${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error('Failed to compare forecast models');
  return res.json();
}

export async function fetchClimateTrends(location: string = 'New Delhi'): Promise<any> {
  const res = await fetch(`${API_BASE}/climate/trends?location=${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error('Failed to fetch climate trends');
  return res.json();
}

export async function fetchVerificationMetrics(): Promise<VerificationMetric[]> {
  const res = await fetch(`${API_BASE}/verification`);
  if (!res.ok) throw new Error('Failed to fetch verification metrics');
  return res.json();
}

export async function fetchAdminSources(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/sources`);
  if (!res.ok) throw new Error('Failed to fetch data sources');
  return res.json();
}

export async function sendChatMessage(message: string, language: string = 'en', sessionId?: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, session_id: sessionId }),
  });
  if (!res.ok) throw new Error('Failed to process message');
  return res.json();
}

export interface StreamCallbacks {
  onStage?: (stageText: string) => void;
  onToken?: (token: string) => void;
  onComplete?: (data: {
    response: string;
    sessionId?: string;
    riskLevel?: string;
    advisory?: string;
    action?: string;
    sources: SourceCitation[];
    suggestedFollowups?: string[];
    context?: any;
  }) => void;
  onError?: (err: Error) => void;
}

export function streamChatMessage(
  message: string,
  language: string = 'en',
  sessionId: string | undefined,
  callbacks: StreamCallbacks
): () => void {
  const controller = new AbortController();

  fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, session_id: sessionId }),
    signal: controller.signal
  }).then(async (response) => {
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let currentEvent = '';

      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEvent = line.replace('event:', '').trim();
        } else if (line.startsWith('data:')) {
          const rawData = line.replace('data:', '').trim();
          try {
            const parsed = JSON.parse(rawData);
            if (currentEvent === 'stage' && callbacks.onStage) {
              callbacks.onStage(parsed.text);
            } else if (currentEvent === 'token' && callbacks.onToken) {
              callbacks.onToken(parsed.token);
            } else if (currentEvent === 'done' && callbacks.onComplete) {
              callbacks.onComplete({
                response: parsed.response,
                sessionId: parsed.session_id,
                riskLevel: parsed.risk_level,
                advisory: parsed.advisory,
                action: parsed.action,
                sources: parsed.sources,
                suggestedFollowups: parsed.suggested_followups,
                context: parsed.weather_context
              });
            }
          } catch (e) {
            // raw text token
            if (callbacks.onToken) callbacks.onToken(rawData);
          }
        }
      }
    }
  }).catch((err) => {
    if (err.name !== 'AbortError' && callbacks.onError) {
      callbacks.onError(err);
    }
  });

  return () => controller.abort();
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationSearchResult> {
  const res = await fetch(`${API_BASE}/locations/reverse?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to reverse geocode location');
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ access_token: string; user: any }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function registerUser(name: string, email: string, password: string): Promise<{ access_token: string; user: any }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}
