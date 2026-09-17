import React, { useState, useEffect } from 'react';
import { Sprout, AlertCircle, Droplets, Wind, ShieldCheck } from 'lucide-react';
import { fetchAgriAdvisories } from '@/services/api';
import { AgriAdvisoryItem } from '@/types';

export const AgriPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<AgriAdvisoryItem[]>([]);
  const [selectedState, setSelectedState] = useState('Punjab');
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Rice)');

  useEffect(() => {
    fetchAgriAdvisories(selectedState).then((data) => setAdvisories(data));
  }, [selectedState]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              Gramin Krishi Mausam Seva (Agri Advisory)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative district-level crop weather advisories from IMD AAS and State Agricultural Universities.
          </p>
        </div>

        {/* State and Crop Selectors */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none"
          >
            <option value="Punjab">Punjab</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {advisories.map((advisory) => (
          <div
            key={advisory.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                  {advisory.state} • {advisory.district} District
                </span>
                <h3 className="text-base font-extrabold text-[#0f2942] mt-1.5">
                  {advisory.crop} ({advisory.growth_stage})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Valid till {advisory.valid_until}
              </span>
            </div>

            {/* Current Weather Summary */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-950 font-medium leading-relaxed">
              <strong>Weather Diagnostics:</strong> {advisory.current_weather_summary}
            </div>

            {/* Official Advisory */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Official Operational Advisory
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {advisory.official_advisory}
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {advisory.spray_recommendation && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <Wind className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chemical Spraying Directive</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{advisory.spray_recommendation}</p>
                </div>
              )}

              {advisory.irrigation_recommendation && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Irrigation Management</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{advisory.irrigation_recommendation}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Source: {advisory.source}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Authoritative ICAR-IMD AAS Grounding
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
