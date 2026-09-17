import React from 'react';
import { Disc, ChevronRight, Wind, Navigation, MapPin } from 'lucide-react';
import { CycloneData } from '@/types';
import { getTranslation } from '@/i18n/translations';

interface CycloneTrackingCardProps {
  cyclone?: CycloneData;
  onViewDetails: () => void;
  selectedLanguage?: string;
}

export const CycloneTrackingCard: React.FC<CycloneTrackingCardProps> = ({
  cyclone,
  onViewDetails,
  selectedLanguage = 'en',
}) => {
  const t = getTranslation(selectedLanguage);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Disc className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold text-[#0f2942] dark:text-slate-100">{t.cyclone_tracking_title}</h3>
        </div>
        <button
          onClick={onViewDetails}
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
        >
          <span>{t.view_details}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Satellite thumbnail */}
        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner flex-shrink-0 relative bg-slate-900">
          <img
            src="/assets/cyclone_satellite.jpg"
            alt="Cyclone Satellite"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1">
            <span className="text-[9px] text-white/90 font-mono">INSAT-3DR</span>
          </div>
        </div>

        {/* Cyclone Specs */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-[#0f2942] dark:text-slate-100">Cyclone (Bay of Bengal)</h4>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
              Severe
            </span>
          </div>

          <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            <p className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-slate-400" />
              <span>Movement: <strong className="text-slate-800 dark:text-slate-100">NW at 12 km/h</strong></span>
            </p>
            <p className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-slate-400" />
              <span>Wind Speed: <strong className="text-slate-800 dark:text-slate-100">120 km/h</strong></span>
            </p>
            <p className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>Expected Landfall: <strong>18 Sep (evening)</strong></span>
            </p>
          </div>

          <button
            onClick={onViewDetails}
            className="mt-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
          >
            <span>{t.view_details}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
