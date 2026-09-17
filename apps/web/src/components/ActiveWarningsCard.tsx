import React from 'react';
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react';
import { CAPWarning } from '@/types';
import { getTranslation } from '@/i18n/translations';

interface ActiveWarningsCardProps {
  warnings: CAPWarning[];
  onViewAll: () => void;
  onSelectWarning: (warning: CAPWarning) => void;
  selectedLanguage?: string;
}

export const ActiveWarningsCard: React.FC<ActiveWarningsCardProps> = ({
  warnings,
  onViewAll,
  onSelectWarning,
  selectedLanguage = 'en',
}) => {
  const t = getTranslation(selectedLanguage);

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900';
      case 'moderate':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold text-[#0f2942] dark:text-slate-100">{t.active_warnings_title}</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5"
        >
          <span>{t.view_all_warnings}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {warnings.slice(0, 3).map((w) => (
          <div
            key={w.id}
            onClick={() => onSelectWarning(w)}
            className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-2"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{w.hazard} Alert</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
                {w.area_desc.split('(')[0].trim()}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                <Clock className="w-2.5 h-2.5" />
                <span>Valid till {w.expires_at}</span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getSeverityBadge(
                w.severity
              )}`}
            >
              {w.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
