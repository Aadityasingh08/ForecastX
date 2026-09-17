import React from 'react';
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react';
import { CAPWarning } from '@/types';

interface ActiveWarningsCardProps {
  warnings: CAPWarning[];
  onViewAll: () => void;
  onSelectWarning: (warning: CAPWarning) => void;
}

export const ActiveWarningsCard: React.FC<ActiveWarningsCardProps> = ({
  warnings,
  onViewAll,
  onSelectWarning,
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold text-[#0f2942]">Active Warnings</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {warnings.slice(0, 3).map((w) => (
          <div
            key={w.id}
            onClick={() => onSelectWarning(w)}
            className="p-2.5 bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/70 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-2"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800">{w.hazard} Alert</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                {w.area_desc.split('(')[0].trim()}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
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
