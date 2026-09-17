import React from 'react';
import { Compass, Sprout, Ship, Plane, BarChart3 } from 'lucide-react';
import { NavItemId } from './Sidebar';
import { getTranslation } from '@/i18n/translations';

interface QuickAccessCardProps {
  onNavigate: (tab: NavItemId) => void;
  selectedLanguage?: string;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ onNavigate, selectedLanguage = 'en' }) => {
  const t = getTranslation(selectedLanguage);

  const items = [
    {
      tab: 'agri' as NavItemId,
      title: t.qa_agri_title,
      subtitle: t.qa_agri_desc,
      icon: Sprout,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    },
    {
      tab: 'marine' as NavItemId,
      title: t.qa_marine_title,
      subtitle: t.qa_marine_desc,
      icon: Ship,
      color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900',
    },
    {
      tab: 'aviation' as NavItemId,
      title: t.qa_aviation_title,
      subtitle: t.qa_aviation_desc,
      icon: Plane,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900',
    },
    {
      tab: 'climate' as NavItemId,
      title: t.qa_climate_title,
      subtitle: t.qa_climate_desc,
      icon: BarChart3,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <Compass className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-extrabold text-[#0f2942] dark:text-slate-100">{t.quick_access_title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.tab}
              onClick={() => onNavigate(it.tab)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left flex items-start gap-2.5 group"
            >
              <div className={`p-2 rounded-xl border ${it.color} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {it.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
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
