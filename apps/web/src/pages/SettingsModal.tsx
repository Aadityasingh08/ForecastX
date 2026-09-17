import React from 'react';
import { X, Globe, Gauge, Bell, Shield, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  tempUnit: 'C' | 'F';
  onTempUnitChange: (u: 'C' | 'F') => void;
  windUnit: 'kmh' | 'knots';
  onWindUnitChange: (u: 'kmh' | 'knots') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onLanguageChange,
  tempUnit,
  onTempUnitChange,
  windUnit,
  onWindUnitChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-[#0f2942]">ForecastX Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Operational Interface Language</span>
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>

        {/* Temperature Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span>Temperature Metric</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onTempUnitChange('C')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                tempUnit === 'C'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Celsius (°C)
            </button>
            <button
              type="button"
              onClick={() => onTempUnitChange('F')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                tempUnit === 'F'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Wind Speed Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800">Wind Velocity Metric</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onWindUnitChange('kmh')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                windUnit === 'kmh'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Kilometers / hr (km/h)
            </button>
            <button
              type="button"
              onClick={() => onWindUnitChange('knots')}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                windUnit === 'knots'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Nautical Knots (kt)
            </button>
          </div>
        </div>

        {/* Demo Mode Status */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-blue-950">Authoritative Demo Simulation</p>
            <p className="text-[11px] text-blue-700">Realistic IMD, MOSDAC & WMO feeds</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            Active
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-colors shadow-sm"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
};
