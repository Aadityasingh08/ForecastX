import React, { useState, useEffect } from 'react';
import { WeatherMap } from '@/components/WeatherMap';
import { fetchCyclones, fetchActiveWarnings } from '@/services/api';
import { CycloneData, CAPWarning } from '@/types';
import { Map as MapIcon, Layers, ShieldAlert, Wind, CloudRain, Radio } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const [cyclones, setCyclones] = useState<CycloneData[]>([]);
  const [warnings, setWarnings] = useState<CAPWarning[]>([]);

  useEffect(() => {
    fetchCyclones().then((d) => setCyclones(d));
    fetchActiveWarnings().then((d) => setWarnings(d));
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">Interactive India Weather GIS Platform</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial layers: IMD Doppler Weather Radar, INSAT-3DR Rapid Scan, CAP alert polygons, and cyclone trajectory vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>Doppler Radar Network Online</span>
          </span>
        </div>
      </div>

      <div className="h-[750px] w-full">
        <WeatherMap
          cyclones={cyclones}
          warnings={warnings}
        />
      </div>
    </div>
  );
};
