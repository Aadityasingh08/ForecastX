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
  X
} from 'lucide-react';

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
}

const NAV_ITEMS = [
  { id: 'dashboard' as NavItemId, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-map' as NavItemId, label: 'Live Map', icon: MapIcon },
  { id: 'search' as NavItemId, label: 'Weather Search', icon: Search },
  { id: 'warnings' as NavItemId, label: 'Warnings & Alerts', icon: AlertTriangle, badge: '3' },
  { id: 'cyclones' as NavItemId, label: 'Cyclones', icon: Disc, badge: 'Active' },
  { id: 'rainfall' as NavItemId, label: 'Rainfall & Nowcast', icon: CloudRain },
  { id: 'agri' as NavItemId, label: 'Agri Advisory', icon: Sprout },
  { id: 'marine' as NavItemId, label: 'Marine & Coastal', icon: Waves },
  { id: 'aviation' as NavItemId, label: 'Aviation', icon: Plane },
  { id: 'climate' as NavItemId, label: 'Climate & Analysis', icon: TrendingUp },
  { id: 'resources' as NavItemId, label: 'Resources', icon: BookOpen },
  { id: 'settings' as NavItemId, label: 'Settings', icon: Settings },
  { id: 'login' as NavItemId, label: 'User Portal / Login', icon: ShieldCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-slate-800">ForecastX Navigation</span>
          <button onClick={onCloseMobile} className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#dbeafe] text-[#1d4ed8] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1d4ed8]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badge === 'Active'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
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
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-blue-50/80 to-slate-100/90 border border-blue-100/80 overflow-hidden relative shadow-sm">
          <div className="relative z-10 space-y-1">
            <h4 className="text-xs font-extrabold text-[#0f2942] tracking-tight leading-snug">
              Be Prepared<br />
              Stay Informed<br />
              Stay Safer
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">Authoritative alerts 24/7</p>
          </div>
          {/* Soft mountain illustration */}
          <div className="mt-2.5 rounded-xl overflow-hidden h-20 w-full relative">
            <img
              src="/assets/preparedness_banner.jpg"
              alt="Preparedness Mountains"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback graphic if image path isn't loaded yet
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
