import React, { useState, useEffect } from 'react';
import {
  Sprout,
  AlertCircle,
  Droplets,
  Wind,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { fetchAgriAdvisories, fetchAgriDecision } from '@/services/api';
import { AgriAdvisoryItem, AgriDecisionResponse } from '@/types';

export const AgriPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<AgriAdvisoryItem[]>([]);
  const [selectedState, setSelectedState] = useState('Punjab');
  
  // Live Decision Tool State
  const [locQuery, setLocQuery] = useState('Karnal');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [liveDecision, setLiveDecision] = useState<AgriDecisionResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchAgriAdvisories(selectedState).then((data) => setAdvisories(data));
  }, [selectedState]);

  // Initial live analysis
  useEffect(() => {
    handleRunAnalysis('Karnal', 'Wheat');
  }, []);

  const handleRunAnalysis = async (loc: string, crop: string) => {
    if (!loc.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await fetchAgriDecision(loc, crop);
      setLiveDecision(data);
    } catch (err) {
      console.error('Failed to run agri decision:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              Gramin Krishi Mausam Seva & Kisan Copilot
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded crop-weather decision intelligence for pesticide spraying windows, irrigation management, and pest warnings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">State Archive:</span>
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

      {/* Live Kisan Agro-Decision Copilot Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-[#0f2942] to-slate-900 rounded-2xl p-6 shadow-xl border border-emerald-500/20 text-white space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-wide">
                Live Kisan Crop-Weather Decision Copilot (लाइव किसान परामर्श)
              </h3>
              <p className="text-xs text-emerald-200/80">
                Type any Indian district or farm location to calculate real-time spraying feasibility and soil moisture demands.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-[11px] font-bold">
            ● Live Synchronized Feed
          </span>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={locQuery}
              onChange={(e) => setLocQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis(locQuery, selectedCrop)}
              placeholder="Enter district (e.g. Karnal, Ludhiana, Kanpur, Nashik)..."
              className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/20 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Paddy">Paddy / Rice (धान)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={() => handleRunAnalysis(locQuery, selectedCrop)}
              disabled={isAnalyzing}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Field'}
            </button>
          </div>
        </div>

        {/* Live Analysis Results */}
        {liveDecision && (
          <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in duration-200">
            {/* Location & Conditions Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Station:</span>
                <span className="font-extrabold text-emerald-300">{liveDecision.location}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Crop:</span>
                <span className="font-extrabold text-white">{liveDecision.crop}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span>🌡️ {liveDecision.current_temperature}°C</span>
                <span>💧 {liveDecision.current_humidity}% RH</span>
                <span>💨 {liveDecision.wind_speed_kmph} km/h</span>
                <span>🌧️ 24h Rain: {liveDecision.rain_probability_next_24h.toFixed(0)}%</span>
              </div>
            </div>

            {/* Decision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Chemical Spray Window */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-300" />
                    <span className="font-extrabold text-white">Chemical & Foliar Spray Window</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveDecision.spray_window_status === 'OPTIMAL'
                        ? 'bg-emerald-500 text-slate-950'
                        : liveDecision.spray_window_status === 'UNFAVORABLE'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {liveDecision.spray_window_status}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {liveDecision.spray_recommendation}
                </p>
              </div>

              {/* Irrigation Management */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span className="font-extrabold text-white">Irrigation Management</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveDecision.irrigation_status === 'POSTPONE'
                        ? 'bg-rose-500 text-white'
                        : liveDecision.irrigation_status === 'RECOMMENDED'
                        ? 'bg-blue-400 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {liveDecision.irrigation_status}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {liveDecision.irrigation_recommendation}
                </p>
              </div>

              {/* Harvesting Window */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-300" />
                    <span className="font-extrabold text-white">Harvest & Threshing Window</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveDecision.harvest_window_status === 'SAFE'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {liveDecision.harvest_window_status}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {liveDecision.harvest_recommendation}
                </p>
              </div>

              {/* Disease & Pest Vulnerability */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-300" />
                    <span className="font-extrabold text-white">Fungal Spore & Pest Vulnerability</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveDecision.disease_pest_risk === 'HIGH'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : liveDecision.disease_pest_risk === 'MODERATE'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    Risk: {liveDecision.disease_pest_risk}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {liveDecision.disease_pest_advisory}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Regional Bulletins */}
      <div className="space-y-4 pt-2">
        <h3 className="font-extrabold text-sm text-[#0f2942] uppercase tracking-wider">
          Official ICAR-IMD Agro-Meteorological Advisory Bulletins ({selectedState})
        </h3>
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
