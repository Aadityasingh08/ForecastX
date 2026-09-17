import React, { useState, useEffect } from 'react';
import { Plane, Wind, Eye, Compass, Cloud, Gauge, ArrowRight } from 'lucide-react';
import { fetchAviationWeather } from '@/services/api';
import { AviationWeatherReport } from '@/types';

export const AviationPage: React.FC = () => {
  const [reports, setReports] = useState<AviationWeatherReport[]>([]);
  const [searchAirport, setSearchAirport] = useState('');

  useEffect(() => {
    fetchAviationWeather().then((data) => setReports(data));
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.airport_iata.toLowerCase().includes(searchAirport.toLowerCase()) ||
      r.airport_icao.toLowerCase().includes(searchAirport.toLowerCase()) ||
      r.city.toLowerCase().includes(searchAirport.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">Aviation Meteorological Services</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ICAO METAR and TAF aerodrome reports decoded for flight dispatch and navigation.
          </p>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchAirport}
            onChange={(e) => setSearchAirport(e.target.value)}
            placeholder="Search airport (e.g. DEL, BOM, BBI)..."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.airport_icao}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-sm border border-indigo-100">
                  {r.airport_iata}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {r.airport_name} ({r.airport_icao})
                  </h3>
                  <p className="text-xs text-slate-500">{r.city}, India • {r.observation_time}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                  r.flight_category === 'VFR'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                Category: {r.flight_category}
              </span>
            </div>

            {/* Raw METAR String */}
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner">
              <span className="text-slate-500 mr-2 select-none">RAW METAR:</span>
              <span>{r.metar_raw}</span>
            </div>

            {/* Decoded Parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                  <Wind className="w-3.5 h-3.5 text-blue-600" />
                  <span>Wind</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800 mt-1">
                  {r.wind_direction_degrees}° at {r.wind_speed_knots} kt
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Visibility</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800 mt-1">
                  {r.visibility_meters >= 4000 ? `${r.visibility_meters / 1000} km` : `${r.visibility_meters} m`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                  <Cloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ceiling & Clouds</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {r.clouds_description}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Altimeter (QNH)</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800 mt-1">
                  {r.altimeter_qnh_hpa} hPa
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
