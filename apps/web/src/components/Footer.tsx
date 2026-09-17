import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white/70 py-3.5 px-4 lg:px-6 text-xs text-slate-500">
      <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#0f2942]">ForecastX</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-medium text-slate-600">
            Conversational Weather Intelligence for a Safer India
          </span>
        </div>

        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 flex-wrap justify-center">
          <span>Powered by</span>
          <strong className="text-slate-700">IMD</strong>
          <span>•</span>
          <strong className="text-slate-700">ISRO (MOSDAC)</strong>
          <span>•</span>
          <strong className="text-slate-700">WMO</strong>
          <span>•</span>
          <strong className="text-slate-700">ECMWF</strong>
          <span>•</span>
          <strong className="text-slate-700">NOAA</strong>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
          <span>🇮🇳</span>
          <span>Made for a Safer, Resilient India</span>
        </div>
      </div>
    </footer>
  );
};
