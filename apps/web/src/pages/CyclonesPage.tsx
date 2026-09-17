import React, { useState, useEffect } from 'react';
import { Disc, Wind, Gauge, Navigation, MapPin, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { fetchCyclones } from '@/services/api';
import { CycloneData } from '@/types';

export const CyclonesPage: React.FC = () => {
  const [cyclones, setCyclones] = useState<CycloneData[]>([]);
  const [activeCyclone, setActiveCyclone] = useState<CycloneData | null>(null);

  useEffect(() => {
    fetchCyclones().then((data) => {
      setCyclones(data);
      if (data.length > 0) setActiveCyclone(data[0]);
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Cyclone Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Disc className="w-6 h-6 text-red-600 animate-spin" style={{ animationDuration: '8s' }} />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              National Cyclone Tracking & Warning Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time RSMC New Delhi (Regional Specialized Meteorological Centre) Tropical Cyclone advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 font-extrabold text-xs rounded-xl border border-red-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>1 Active System: Bay of Bengal</span>
          </span>
        </div>
      </div>

      {activeCyclone && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Satellite & Vital Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Satellite Frame */}
              <div className="rounded-xl overflow-hidden border border-slate-200 relative aspect-square bg-slate-950">
                <img
                  src="/assets/cyclone_satellite.jpg"
                  alt="Cyclone Satellite Imagery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-[10px] font-mono">
                  INSAT-3DR Rapid Scan Visible
                </div>
                <div className="absolute bottom-2 right-2 bg-red-600/90 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                  Cat 1 / Severe Cyclonic Storm
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded uppercase">
                  {activeCyclone.current_category}
                </span>
                <h3 className="text-sm font-extrabold text-red-950">
                  {activeCyclone.name}
                </h3>
                <p className="text-xs text-red-800 font-medium">
                  Landfall Target: <strong>{activeCyclone.expected_landfall_location}</strong>
                </p>
                <p className="text-[11px] text-red-700">
                  Timeline: <strong>{activeCyclone.expected_landfall_time}</strong>
                </p>
              </div>

              {/* Core Meteorological Gauges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px] font-medium">Max Sustained Wind</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">
                    {activeCyclone.max_sustained_wind_kmph} km/h
                  </p>
                  <p className="text-[10px] text-red-600 font-semibold">Gusting to 135 km/h</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px] font-medium">Central Pressure</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">
                    {activeCyclone.estimated_central_pressure_hpa} hPa
                  </p>
                  <p className="text-[10px] text-slate-500">Deep Low Pressure Core</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px] font-medium">Translation Speed</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">
                    {activeCyclone.movement_speed_kmph} km/h
                  </p>
                  <p className="text-[10px] text-slate-500">Direction: {activeCyclone.movement_direction}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-400 text-[10px] font-medium">Current Eye Center</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">
                    {activeCyclone.center_latitude}°N, {activeCyclone.center_longitude}°E
                  </p>
                  <p className="text-[10px] text-slate-500">Westcentral Bay of Bengal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Trajectory Track Points & Warnings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Warnings Bulletin */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>RSMC Official Cyclone Warnings</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeCyclone.warnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Track Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider mb-3">
                Official Observed & Forecast Trajectory Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[10px]">
                      <th className="pb-2">VALID TIME</th>
                      <th className="pb-2">COORDINATES</th>
                      <th className="pb-2">CATEGORY</th>
                      <th className="pb-2">WIND (KM/H)</th>
                      <th className="pb-2">PRESSURE</th>
                      <th className="pb-2 text-right">TYPE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeCyclone.track.map((pt, idx) => (
                      <tr key={idx} className={pt.is_forecast ? 'bg-amber-50/40' : ''}>
                        <td className="py-2.5 font-medium whitespace-nowrap">{pt.time}</td>
                        <td className="py-2.5 font-mono text-[11px]">
                          {pt.latitude.toFixed(1)}°N, {pt.longitude.toFixed(1)}°E
                        </td>
                        <td className="py-2.5 font-semibold text-slate-800">{pt.category}</td>
                        <td className="py-2.5 font-bold text-red-700">{pt.wind_speed_kmph}</td>
                        <td className="py-2.5 text-slate-500">{pt.pressure_hpa} hPa</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                              pt.is_forecast
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {pt.is_forecast ? 'Forecast' : 'Observed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
