import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets, Gauge, Sun, CloudRain, Clock, MapPin, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchForecast, fetchCurrentWeather, searchLocations } from '@/services/api';
import { CurrentWeather, WeatherForecastResponse, LocationSearchResult } from '@/types';

interface WeatherSearchPageProps {
  initialCity?: string;
}

export const WeatherSearchPage: React.FC<WeatherSearchPageProps> = ({ initialCity = 'Kanpur' }) => {
  const [query, setQuery] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastResponse | null>(null);
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity]);

  const loadWeatherData = async (cityName: string) => {
    setIsLoading(true);
    try {
      const [currentData, forecastData] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName),
      ]);
      setWeather(currentData);
      setForecast(forecastData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    loadWeatherData(query.trim());
    setSelectedCity(query.trim());
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
            const loc = await res.json();
            setQuery(loc.name);
            setSelectedCity(loc.name);
            loadWeatherData(loc.name);
          }
        } catch (err) {
          console.error('Failed to resolve location', err);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setIsLoading(false);
        alert('Could not determine your GPS location. Please check browser permissions.');
      }
    );
  };

  const quickCities = ['New Delhi', 'Kanpur', 'Mumbai', 'Kolkata', 'Chennai', 'Jaipur', 'Bhubaneswar'];

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Indian city, district, pincode (e.g. 208001), or coordinates..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUseLiveLocation}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Use Live Location</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              Search Weather
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Popular:</span>
          {quickCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                setQuery(c);
                setSelectedCity(c);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-blue-100 text-blue-800 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {weather && (
        <>
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-white to-blue-50/40 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-extrabold text-[#0f2942]">
                    {weather.city_name}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {weather.district}, {weather.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Observed: {weather.observed_at}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-700">{weather.source}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-[#0f2942]">
                    {Math.round(weather.temperature)}°C
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Feels like {Math.round(weather.feels_like)}°C
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-blue-100/60 border border-blue-200 rounded-xl text-xs font-bold text-blue-800">
                  {weather.condition}
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Humidity</p>
                  <p className="text-sm font-bold text-slate-800">{weather.humidity}%</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Wind Speed</p>
                  <p className="text-sm font-bold text-slate-800">
                    {weather.wind_speed} km/h ({weather.wind_direction})
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Barometric Pressure</p>
                  <p className="text-sm font-bold text-slate-800">{weather.pressure} hPa</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">UV Index</p>
                  <p className="text-sm font-bold text-slate-800">{weather.uv_index || 'Moderate'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast Chart */}
          {forecast && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f2942]">24-Hour Temperature & Rainfall Forecast</h3>
                <span className="text-xs text-slate-400 font-medium">Model: {forecast.model}</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast.hourly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
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
                      type="monotone"
                      dataKey="temperature"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#2563eb' }}
                      name="Temperature (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="rainfall_mm"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Rainfall (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 5-Day Daily Forecast Cards */}
          {forecast && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f2942] mb-3">7-Day Daily Forecast Outlook</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {forecast.daily.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border transition-all text-center space-y-1.5 ${
                      d.warning_severity
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{d.day_name}</p>
                    <p className="text-[11px] text-slate-500">{d.date}</p>
                    <p className="text-xs font-semibold text-blue-700 py-1">{d.condition}</p>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold">
                      <span className="text-slate-800">{Math.round(d.temp_max)}°</span>
                      <span className="text-slate-400 font-normal">{Math.round(d.temp_min)}°</span>
                    </div>
                    {d.rain_probability !== null && (
                      <p className="text-[10px] font-bold text-cyan-700">
                        {d.rain_probability}% Rain Prob.
                      </p>
                    )}
                    {d.warning_severity && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800">
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
    </div>
  );
};
