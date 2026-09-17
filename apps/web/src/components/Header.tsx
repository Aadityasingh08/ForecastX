import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Globe, Menu, X, CloudSun, MapPin, Navigation, LogIn, LogOut, UserCheck } from 'lucide-react';
import { reverseGeocode, fetchCurrentWeather } from '@/services/api';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
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
  onToggleSidebar,
  onOpenSettings,
  onOpenLogin,
  currentUser,
  onLogout,
  onLiveLocationChange,
}) => {
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
          // Reverse geocode to get nearest Indian city/district
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
        setLiveLocationName('New Delhi (GPS Default)');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  ];

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'J';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <CloudSun className="w-6 h-6 text-amber-500 fill-amber-400" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#0f2942]">Forecast</span>
                <span className="text-xl font-extrabold text-blue-600">X</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Conversational Weather Intelligence for a Safer India
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
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 transition-all flex-shrink-0 shadow-xs"
          >
            <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating ? 'Detecting GPS...' : `Live: ${liveLocationName}`}
            </span>
            {liveLocationTemp !== null && !isLocating && (
              <span className="text-white bg-blue-600 px-1.5 py-0.2 rounded-md text-[11px] font-extrabold">
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
              placeholder="Search city, district or ask a weather question..."
              className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
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

        {/* Right: Language, Notifications, Live GPS Trigger (mobile), User Profile / Login */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile GPS locate icon */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            className="sm:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Detect Live Location"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">
                {languages.find((l) => l.code === selectedLanguage)?.label.split(' ')[0] || 'English'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      selectedLanguage === lang.code ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {selectedLanguage === lang.code && <span className="text-blue-600">✓</span>}
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
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-semibold text-slate-800">Active Warning Feeds</span>
                  <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold">3 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50/70 border border-red-200 rounded-lg">
                    <p className="font-bold text-red-700">Cyclone Alert (Bay of Bengal)</p>
                    <p className="text-slate-600 mt-0.5">High Severity • Coastal North Odisha & West Bengal</p>
                  </div>
                  <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <p className="font-bold text-amber-700">Heavy Rainfall Warning</p>
                    <p className="text-slate-600 mt-0.5">Moderate Severity • Odisha & Andhra Pradesh</p>
                  </div>
                  <div className="p-2 bg-yellow-50/70 border border-yellow-200 rounded-lg">
                    <p className="font-bold text-yellow-800">Thunderstorm & Lightning</p>
                    <p className="text-slate-600 mt-0.5">Watch Alert • Bihar, Jharkhand, West Bengal</p>
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
                className="flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#13315c] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitial}
                </div>
                <div className="text-left hidden md:block leading-tight">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.role || 'Member'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.2 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                      {currentUser.role || 'Meteorologist'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    Preferences & Units
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenLogin) onOpenLogin();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    Switch User / Role
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-1.5 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
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
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
