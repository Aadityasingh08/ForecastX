import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Clock, MapPin, ExternalLink, Filter, CheckCircle } from 'lucide-react';
import { fetchActiveWarnings } from '@/services/api';
import { CAPWarning } from '@/types';

export const WarningsPage: React.FC = () => {
  const [warnings, setWarnings] = useState<CAPWarning[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [activeWarningDetail, setActiveWarningDetail] = useState<CAPWarning | null>(null);

  useEffect(() => {
    fetchActiveWarnings().then((data) => {
      setWarnings(data);
      if (data.length > 0) setActiveWarningDetail(data[0]);
    });
  }, []);

  const hazards = ['all', 'Cyclone', 'Heavy Rain', 'Thunderstorm'];
  const severities = ['all', 'High', 'Moderate', 'Watch'];
  const states = ['all', 'Odisha', 'West Bengal', 'Bihar'];

  const filtered = warnings.filter((w) => {
    if (selectedHazard !== 'all' && !w.hazard.toLowerCase().includes(selectedHazard.toLowerCase())) return false;
    if (selectedSeverity !== 'all' && w.severity.toLowerCase() !== selectedSeverity.toLowerCase()) return false;
    if (selectedState !== 'all' && !w.state.toLowerCase().includes(selectedState.toLowerCase())) return false;
    return true;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'severe':
      case 'high':
        return { badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-4 border-l-red-500' };
      case 'moderate':
        return { badge: 'bg-amber-100 text-amber-800 border-amber-200', border: 'border-l-4 border-l-amber-500' };
      default:
        return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', border: 'border-l-4 border-l-yellow-500' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              National CAP Warning & Alert Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official Common Alerting Protocol (CAP) feeds directly ingested from IMD and State Disaster Management Authorities.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedHazard}
            onChange={(e) => setSelectedHazard(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Hazards</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Heavy Rain">Heavy Rain</option>
            <option value="Thunderstorm">Thunderstorm</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="High">High (Red)</option>
            <option value="Moderate">Moderate (Orange)</option>
            <option value="Watch">Watch (Yellow)</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="Odisha">Odisha</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Bihar">Bihar</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Warning List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filtered.map((w) => {
            const style = getSeverityStyle(w.severity);
            const isSelected = activeWarningDetail?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setActiveWarningDetail(w)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${style.border} ${
                  isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500/30' : 'border-slate-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${style.badge}`}>
                    {w.severity} • {w.hazard}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{w.id}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                  {w.headline}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{w.area_desc}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Valid till {w.expires_at}
                  </span>
                  <span className="text-blue-600 font-semibold">View Detail →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Detailed View (7 cols) */}
        <div className="lg:col-span-7">
          {activeWarningDetail ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-extrabold border ${getSeverityStyle(
                      activeWarningDetail.severity
                    ).badge}`}
                  >
                    {activeWarningDetail.severity.toUpperCase()} SEVERITY ALERT
                  </span>
                  <h3 className="text-base font-extrabold text-[#0f2942] mt-2 leading-snug">
                    {activeWarningDetail.headline}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Issued by: <strong>{activeWarningDetail.source}</strong>
                  </p>
                </div>
              </div>

              {/* Timing and Affected Area */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-slate-400 text-[10px] font-medium">Valid From / To</p>
                  <p className="font-bold text-slate-800 mt-0.5">{activeWarningDetail.effective_at}</p>
                  <p className="font-bold text-red-600">Until {activeWarningDetail.expires_at}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-slate-400 text-[10px] font-medium">Geographic Scope</p>
                  <p className="font-bold text-slate-800 mt-0.5">{activeWarningDetail.state}</p>
                  <p className="text-slate-600 truncate">{activeWarningDetail.district || activeWarningDetail.area_desc}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Meteorological Situation</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                  {activeWarningDetail.description}
                </p>
              </div>

              {/* Official Safety Instructions */}
              <div>
                <h4 className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Public Safety & Protective Instructions</span>
                </h4>
                <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed font-medium">
                  {activeWarningDetail.instruction}
                </div>
              </div>

              {/* Attribution */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Standard: OASIS Common Alerting Protocol (CAP v1.2)</span>
                <span className="font-semibold text-emerald-600">● Verified Authentic Feed</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              Select a warning to view official instructions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
