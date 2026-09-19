import React, { useState, useEffect } from 'react';
import {
  Search,
  Wind,
  Droplets,
  Gauge,
  Sun,
  CloudRain,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Compass,
  Share2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchForecast, fetchCurrentWeather, searchLocations } from '@/services/api';
import { CurrentWeather, WeatherForecastResponse, LocationSearchResult } from '@/types';
import { BriefingModal } from '@/components/BriefingModal';

interface WeatherSearchPageProps {
  initialCity?: string;
}

export const WeatherSearchPage: React.FC<WeatherSearchPageProps> = ({ initialCity = 'Kanpur' }) => {
  const [query, setQuery] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastResponse | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity]);

  // Debounced search suggestions as user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchLocations(trimmed);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const loadWeatherData = async (cityName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setShowDropdown(false);
    try {
      const [currentData, forecastData] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName),
      ]);
      setWeather(currentData);
      setForecast(forecastData);
    } catch (e) {
      setErrorMessage(`Weather information for "${cityName}" is temporarily unavailable. Please retry.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSelectedCity(query.trim());
  };

  const handleSelectSuggestion = (loc: LocationSearchResult) => {
    setQuery(loc.name);
    setSelectedCity(loc.name);
    setShowDropdown(false);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/locations/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          if (res.ok) {
            const loc: LocationSearchResult = await res.json();
            setQuery(loc.name);
            setSelectedCity(loc.name);
          }
        } catch (err) {
          setErrorMessage('Could not reverse geocode your position. Please search manually.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setIsLoading(false);
        alert('Could not determine your GPS location. Please verify browser location permissions.');
      }
    );
  };

  const popularCities = ['New Delhi', 'Kanpur', 'Jaipur', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Pune', 'Varanasi'];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder="Search Indian city, district, pincode (e.g. 208001), or coordinates..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-inner"
            />
            {isSearchingSuggestions && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-blue-600 animate-spin" />
            )}

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700/70 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{s.name}</span>
                        <span className="text-slate-400 ml-1.5 text-[11px]">
                          {s.district ? `${s.district}, ` : ''}{s.state} ({s.country})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {s.latitude.toFixed(2)}°, {s.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUseLiveLocation}
              disabled={isLoading}
              className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
              <span>Live GPS</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              {isLoading ? 'Retrieving...' : 'Search Weather'}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Fast Access:</span>
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                setQuery(c);
                setSelectedCity(c);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      )}

      {!isLoading && weather && (
        <>
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-white via-white to-blue-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-extrabold text-[#0f2942] dark:text-slate-100">
                    {weather.city_name}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {weather.district ? `${weather.district}, ` : ''}{weather.state}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                    weather.is_demo
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {weather.is_demo ? 'DEMO ARCHIVE' : 'LIVE OBSERVATION'}
                  </span>
                  <button
                    onClick={() => setIsBriefingOpen(true)}
                    className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer ml-1"
                  >
                    <Share2 className="w-2.5 h-2.5" />
                    <span>Export Official Briefing</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Observed: {weather.observed_at}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-400">{weather.source}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-[#0f2942] dark:text-slate-100">
                    {Math.round(weather.temperature)}°C
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                    Feels like {Math.round(weather.feels_like)}°C
                  </p>
                </div>
                <div className="px-3.5 py-2 bg-blue-100/70 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-blue-800 dark:text-blue-200 shadow-xs">
                  {weather.condition}
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Relative Humidity</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{weather.humidity}%</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Surface Wind</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {weather.wind_speed} km/h ({weather.wind_direction})
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Barometric Pressure</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{weather.pressure} hPa</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">UV Radiation</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{weather.uv_index || 'Moderate'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast Chart */}
          {forecast && forecast.hourly && forecast.hourly.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0f2942] dark:text-slate-100">
                    24-Hour Atmospheric Trend (Hourly Temperature & Precipitation)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Calculated from ECMWF Integrated Forecasting System (HRES 0.1°)
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">{forecast.model}</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast.hourly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="temp" stroke="#2563eb" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} unit="°C" />
                    <YAxis yAxisId="rain" orientation="right" stroke="#06b6d4" fontSize={11} domain={[0, 'dataMax + 5']} unit="mm" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#2563eb' }}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="rain"
                      type="monotone"
                      dataKey="rainfall_mm"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 2, fill: '#06b6d4' }}
                      name="Precipitation (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 7-Day Daily Forecast Cards */}
          {forecast && forecast.daily && forecast.daily.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#0f2942] dark:text-slate-100">
                  7-Day Outlook & Hazard Evaluation
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Valid for {weather.city_name}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecast.daily.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border transition-all text-center space-y-1.5 ${
                      d.warning_severity === 'High'
                        ? 'border-red-300 bg-red-50/40 dark:bg-red-950/20'
                        : d.warning_severity === 'Moderate'
                        ? 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{d.day_name}</p>
                    <p className="text-[10px] text-slate-400">{d.date}</p>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 py-1 min-h-[32px] flex items-center justify-center">
                      {d.condition}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-100">{Math.round(d.temp_max)}°</span>
                      <span className="text-slate-400 font-normal">{Math.round(d.temp_min)}°</span>
                    </div>
                    {d.rain_probability !== null && (
                      <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                        {d.rain_probability}% Rain Prob.
                      </p>
                    )}
                    {d.warning_severity && (
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                        d.warning_severity === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {d.warning_severity} Alert
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Official Meteorological Briefing Modal */}
      {isBriefingOpen && weather && (
        <BriefingModal
          locationName={weather.city_name}
          isOpen={isBriefingOpen}
          onClose={() => setIsBriefingOpen(false)}
        />
      )}
    </div>
  );
};
