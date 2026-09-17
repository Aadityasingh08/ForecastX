import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Globe,
  Menu,
  X,
  CloudSun,
  MapPin,
  Navigation,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { reverseGeocode, fetchCurrentWeather } from '@/services/api';
import { getTranslation } from '@/i18n/translations';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
  onOpenLogin?: () => void;
  currentUser: any;
  onLogout: () => void;
  onLiveLocationChange?: (lat: number, lon: number, cityName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchSubmit,
  selectedLanguage,
  onLanguageChange,
  theme,
  onToggleTheme,
  onToggleSidebar,
  onOpenSettings,
  onOpenLogin,
  currentUser,
  onLogout,
  onLiveLocationChange,
}) => {
  const t = getTranslation(selectedLanguage);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Live Location states
  const [isLocating, setIsLocating] = useState(false);
  const [liveLocationName, setLiveLocationName] = useState<string | null>('New Delhi');
  const [liveLocationTemp, setLiveLocationTemp] = useState<number | null>(32);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          const weather = await fetchCurrentWeather(loc.name, latitude, longitude);
          setLiveLocationName(loc.name);
          setLiveLocationTemp(Math.round(weather.temperature));
          if (onLiveLocationChange) {
            onLiveLocationChange(latitude, longitude, loc.name);
          }
        } catch (e) {
          console.error('Failed to resolve live location:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or unavailable, using national center coordinates:', err);
        setIsLocating(false);
        setLiveLocationName('New Delhi (GPS)');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'हिंदी', native: 'Hindi' },
    { code: 'bn', label: 'বাংলা', native: 'Bengali' },
    { code: 'ta', label: 'தமிழ்', native: 'Tamil' },
    { code: 'te', label: 'తెలుగు', native: 'Telugu' },
    { code: 'mr', label: 'मराठी', native: 'Marathi' },
    { code: 'gu', label: 'ગુજરાતી', native: 'Gujarati' },
  ];

  const currentLangLabel = languages.find((l) => l.code === selectedLanguage)?.label || 'English';
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'J';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-4 lg:px-6 py-2.5 shadow-xs transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-xs">
              <CloudSun className="w-6 h-6 text-amber-500 fill-amber-400" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#0f2942] dark:text-slate-100">Forecast</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">X</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.brand_tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Location Pill & Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 lg:mx-4 flex items-center gap-2">
          {/* Live Location Quick Pill */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            title="Click to detect your live GPS location"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold text-blue-900 dark:text-blue-200 transition-all flex-shrink-0 shadow-xs"
          >
            <Navigation className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating ? t.detecting_gps : `${t.live_badge}: ${liveLocationName}`}
            </span>
            {liveLocationTemp !== null && !isLocating && (
              <span className="text-white bg-blue-600 dark:bg-blue-500 px-1.5 py-0.2 rounded-md text-[11px] font-extrabold">
                {liveLocationTemp}°C
              </span>
            )}
          </button>

          <form onSubmit={handleSearch} className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search_placeholder}
              className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right: Theme Toggle, Language, Notifications, User Profile / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile GPS locate icon */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            className="sm:hidden p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            title="Detect Live Location"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Dark / Light Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? t.theme_light : t.theme_dark}
            aria-label="Toggle Dark / Light Theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold">{currentLangLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${
                      selectedLanguage === lang.code
                        ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{lang.label} ({lang.native})</span>
                    {selectedLanguage === lang.code && <span className="text-blue-600 dark:text-blue-400 font-extrabold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{t.active_warnings_title}</span>
                  <span className="bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded text-[10px] font-bold">3 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
                    <p className="font-bold text-red-700 dark:text-red-300">Cyclone Alert (Bay of Bengal)</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">High Severity • Coastal North Odisha & West Bengal</p>
                  </div>
                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                    <p className="font-bold text-amber-700 dark:text-amber-300">Heavy Rainfall Warning</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">Moderate Severity • Odisha & Andhra Pradesh</p>
                  </div>
                  <div className="p-2.5 bg-yellow-50/70 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 rounded-xl">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Thunderstorm & Lightning</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">Watch Alert • Bihar, Jharkhand, West Bengal</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Area */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-[#13315c] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitial}
                </div>
                <div className="text-left hidden md:block leading-tight">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.role || 'Member'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-100 dark:border-blue-900">
                      {currentUser.role || 'Meteorologist'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    Preferences & Units
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    Switch User / Role
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.sign_out}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.sign_in}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
