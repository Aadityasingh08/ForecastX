import React from 'react';
import { Compass, Sprout, Ship, Plane, BarChart3 } from 'lucide-react';
import { NavItemId } from './Sidebar';

interface QuickAccessCardProps {
  onNavigate: (tab: NavItemId) => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ onNavigate }) => {
  const items = [
    {
      tab: 'agri' as NavItemId,
      title: 'Agri Advisory',
      subtitle: 'Crop-specific guidance',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      tab: 'marine' as NavItemId,
      title: 'Marine Forecast',
      subtitle: 'Coastal & ocean alerts',
      icon: Ship,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    },
    {
      tab: 'aviation' as NavItemId,
      title: 'Aviation Weather',
      subtitle: 'Airport forecasts',
      icon: Plane,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      tab: 'climate' as NavItemId,
      title: 'Climate Insights',
      subtitle: 'Trends & historical data',
      icon: BarChart3,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Compass className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-extrabold text-[#0f2942]">Quick Access</h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.tab}
              onClick={() => onNavigate(it.tab)}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all text-left flex items-start gap-2.5 group"
            >
              <div className={`p-2 rounded-xl border ${it.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-800 tracking-tight truncate group-hover:text-blue-600 transition-colors">
                  {it.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {it.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
