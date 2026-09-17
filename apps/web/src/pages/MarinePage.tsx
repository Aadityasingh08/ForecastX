import React, { useState, useEffect } from 'react';
import { Waves, Ship, AlertTriangle, Wind, Compass, ShieldAlert } from 'lucide-react';
import { fetchMarineWeather } from '@/services/api';
import { MarineWeatherReport } from '@/types';

export const MarinePage: React.FC = () => {
  const [reports, setReports] = useState<MarineWeatherReport[]>([]);

  useEffect(() => {
    fetchMarineWeather().then((data) => setReports(data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-cyan-700" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              Marine & Ocean Meteorological Services
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Wave rider buoys, coastal swell models, port hazard signals, and fishermen high-seas warnings from INCOIS and IMD.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{r.station_or_port}</h3>
                <p className="text-xs text-slate-500">{r.state} Coast</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  r.sea_state === 'Very Rough'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}
              >
                Sea State: {r.sea_state}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-slate-400 text-[10px]">Significant Wave Height</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{r.wave_height_meters} m</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-slate-400 text-[10px]">Swell Period</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{r.swell_period_seconds} s ({r.swell_direction})</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-slate-400 text-[10px]">Surface Wind</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{r.wind_speed_knots} kt ({r.wind_direction})</p>
              </div>
            </div>

            {/* Warnings */}
            {r.coastal_warning && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed font-medium">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Port Danger Signal</span>
                </div>
                {r.coastal_warning}
              </div>
            )}

            {r.fishermen_warning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>High-Seas Fishermen Warning</span>
                </div>
                {r.fishermen_warning}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
