import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Share2,
  Check,
  ShieldAlert,
  Calendar,
  Clock,
  Compass,
  Thermometer,
  Wind,
  Droplets,
  CloudRain
} from 'lucide-react';
import { BriefingResponse } from '@/types';
import { fetchBriefing } from '@/services/api';

interface BriefingModalProps {
  locationName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  locationName,
  isOpen,
  onClose,
}) => {
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetchBriefing(locationName)
      .then((data) => {
        setBriefing(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load briefing:', err);
        setIsLoading(false);
      });
  }, [isOpen, locationName]);

  if (!isOpen) return null;

  const handleCopyWhatsApp = () => {
    if (!briefing?.whatsapp_text) return;
    navigator.clipboard.writeText(briefing.whatsapp_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 my-8">
        {/* Header Strip */}
        <div className="bg-[#0f2942] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base tracking-wide uppercase">
                Meteorological Decision Briefing
              </h3>
            </div>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Official Grounded Multi-Source Synoptic Report • Incident Command Format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">
                Synthesizing multi-source synoptic observations for {locationName}...
              </p>
            </div>
          ) : briefing ? (
            <>
              {/* Station Metadata Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Station / Location</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{briefing.location}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Timestamp (IST)</span>
                  <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>{briefing.issued_at}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coordinates</span>
                  <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-blue-600" />
                    <span>{briefing.latitude.toFixed(2)}°N, {briefing.longitude.toFixed(2)}°E</span>
                  </p>
                </div>
              </div>

              {/* Risk Level Badge & Advisory */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-gradient-to-r from-blue-50/40 to-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Overall Hazard Assessment
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      briefing.risk_assessment.overall_risk === 'SEVERE'
                        ? 'bg-purple-600 text-white animate-pulse'
                        : briefing.risk_assessment.overall_risk === 'HIGH'
                        ? 'bg-rose-600 text-white'
                        : briefing.risk_assessment.overall_risk === 'MODERATE'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Risk Level: {briefing.risk_assessment.overall_risk}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-slate-800">
                    <strong>Operational Advisory:</strong> {briefing.risk_assessment.advisory}
                  </p>
                  <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <strong className="text-blue-700">Directive / Action:</strong> {briefing.risk_assessment.action}
                  </p>
                </div>
              </div>

              {/* Verified Metrics Matrix */}
              <div>
                <h4 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider mb-2">
                  Verified Meteorological Readings
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                      <span>Temperature</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{briefing.current_weather.temperature}°C</p>
                    <p className="text-[10px] text-slate-500">Feels like {briefing.current_weather.feels_like}°C</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Rel. Humidity</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{briefing.current_weather.humidity}%</p>
                    <p className="text-[10px] text-slate-500">Pressure {briefing.current_weather.pressure} hPa</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <Wind className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Wind Velocity</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{briefing.current_weather.wind_speed} km/h</p>
                    <p className="text-[10px] text-slate-500">{briefing.current_weather.wind_direction || 'Variable'}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-1 text-slate-400 mb-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                      <span>Rain Rate</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{briefing.current_weather.rainfall_last_hour || 0} mm</p>
                    <p className="text-[10px] text-slate-500">Past hour gauge</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Formatted Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-extrabold text-[#0f2942] uppercase tracking-wider">
                    WhatsApp Incident Broadcast Format
                  </h4>
                  <span className="text-[10px] text-slate-400">Ready to copy & broadcast</span>
                </div>
                <pre className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
                  {briefing.whatsapp_text}
                </pre>
              </div>
            </>
          ) : (
            <p className="text-xs text-rose-600 text-center py-8">
              Unable to generate briefing for this station.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[10px] text-slate-400 font-medium">
            ForecastX Grounded Synoptic Model • Certified
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              disabled={!briefing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={!briefing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
