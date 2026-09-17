import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Search,
  AlertTriangle,
  Disc,
  CloudRain,
  Sprout,
  Waves,
  Plane,
  TrendingUp,
  BookOpen,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { getTranslation } from '@/i18n/translations';

export type NavItemId =
  | 'dashboard'
  | 'live-map'
  | 'search'
  | 'warnings'
  | 'cyclones'
  | 'rainfall'
  | 'agri'
  | 'marine'
  | 'aviation'
  | 'climate'
  | 'resources'
  | 'settings'
  | 'admin'
  | 'login';

interface SidebarProps {
  activeTab: NavItemId;
  onSelectTab: (id: NavItemId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  selectedLanguage?: string;
}

const NAV_ITEMS: { id: NavItemId; labelKey: string; defaultLabel: string; icon: any; badge?: string }[] = [
  { id: 'dashboard', labelKey: 'nav_dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-map', labelKey: 'nav_live_map', defaultLabel: 'Live Map', icon: MapIcon },
  { id: 'search', labelKey: 'nav_search', defaultLabel: 'Weather Search', icon: Search },
  { id: 'warnings', labelKey: 'nav_warnings', defaultLabel: 'Warnings & Alerts', icon: AlertTriangle, badge: '3' },
  { id: 'cyclones', labelKey: 'nav_cyclones', defaultLabel: 'Cyclones', icon: Disc, badge: 'Active' },
  { id: 'rainfall', labelKey: 'nav_rainfall', defaultLabel: 'Rainfall & Nowcast', icon: CloudRain },
  { id: 'agri', labelKey: 'nav_agri', defaultLabel: 'Agri Advisory', icon: Sprout },
  { id: 'marine', labelKey: 'nav_marine', defaultLabel: 'Marine & Coastal', icon: Waves },
  { id: 'aviation', labelKey: 'nav_aviation', defaultLabel: 'Aviation', icon: Plane },
  { id: 'climate', labelKey: 'nav_climate', defaultLabel: 'Climate & Analysis', icon: TrendingUp },
  { id: 'resources', labelKey: 'nav_resources', defaultLabel: 'Resources', icon: BookOpen },
  { id: 'settings', labelKey: 'nav_settings', defaultLabel: 'Settings', icon: Settings },
  { id: 'login', labelKey: 'user_portal', defaultLabel: 'User Portal / Login', icon: ShieldCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  selectedLanguage = 'en',
}) => {
  const t = getTranslation(selectedLanguage);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <span className="font-bold text-slate-800 dark:text-slate-100">ForecastX Navigation</span>
          <button onClick={onCloseMobile} className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = (t as any)[item.labelKey] || item.defaultLabel;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#dbeafe] dark:bg-blue-950/70 text-[#1d4ed8] dark:text-blue-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1d4ed8] dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badge === 'Active'
                        ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Banner Card: "Be Prepared Stay Informed Stay Safer" */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-blue-50/80 to-slate-100/90 dark:from-slate-800/80 dark:to-slate-900/90 border border-blue-100/80 dark:border-slate-700 overflow-hidden relative shadow-sm">
          <div className="relative z-10 space-y-1">
            <h4 className="text-xs font-extrabold text-[#0f2942] dark:text-slate-100 tracking-tight leading-snug">
              Be Prepared<br />
              Stay Informed<br />
              Stay Safer
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Authoritative alerts 24/7</p>
          </div>
          <div className="mt-2.5 rounded-xl overflow-hidden h-20 w-full relative bg-slate-200 dark:bg-slate-800">
            <img
              src="/assets/preparedness_banner.jpg"
              alt="Preparedness Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
