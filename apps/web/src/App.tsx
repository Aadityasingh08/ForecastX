import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar, NavItemId } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Dashboard } from '@/pages/Dashboard';
import { LiveMapPage } from '@/pages/LiveMapPage';
import { WeatherSearchPage } from '@/pages/WeatherSearchPage';
import { WarningsPage } from '@/pages/WarningsPage';
import { CyclonesPage } from '@/pages/CyclonesPage';
import { RainfallPage } from '@/pages/RainfallPage';
import { AgriPage } from '@/pages/AgriPage';
import { MarinePage } from '@/pages/MarinePage';
import { AviationPage } from '@/pages/AviationPage';
import { ClimatePage } from '@/pages/ClimatePage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { SettingsModal } from '@/pages/SettingsModal';
import { LoginModal } from '@/components/LoginModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItemId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Language state persisted in localStorage
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('forecastx_lang') || 'en';
  });

  // Dark / Light Theme state persisted in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('forecastx_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('forecastx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('forecastx_lang', lang);
  };

  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [windUnit, setWindUnit] = useState<'kmh' | 'knots'>('kmh');
  const [searchTargetCity, setSearchTargetCity] = useState<string>('Kanpur');
  const [chatInitiateQuery, setChatInitiateQuery] = useState<string | undefined>(undefined);

  // Current authenticated user state
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('forecastx_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'James Anderson',
      email: 'james@forecastx.gov.in',
      role: 'Senior Meteorologist',
      organization: 'India Meteorological Department (IMD)',
    };
  });

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('forecastx_token');
    localStorage.removeItem('forecastx_user');
    setCurrentUser(null);
  };

  const handleGlobalSearch = (query: string) => {
    const isNaturalQuestion =
      query.includes('?') ||
      /\b(will|is|can|should|why|what|how|rain|cyclone|weather|route)\b/i.test(query);

    if (isNaturalQuestion) {
      setChatInitiateQuery(query);
      setActiveTab('dashboard');
    } else {
      setSearchTargetCity(query);
      setActiveTab('search');
    }
  };

  const handleLiveLocationChange = (lat: number, lon: number, cityName: string) => {
    setSearchTargetCity(cityName);
  };

  const handleTabSelect = (tab: NavItemId) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      return;
    }
    if (tab === 'login') {
      if (!currentUser) {
        setIsLoginModalOpen(true);
        return;
      }
    }
    setActiveTab(tab);
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveTab}
            selectedLanguage={selectedLanguage}
            initialChatQuery={chatInitiateQuery}
          />
        );
      case 'live-map':
        return <LiveMapPage />;
      case 'search':
        return <WeatherSearchPage initialCity={searchTargetCity} />;
      case 'warnings':
        return <WarningsPage />;
      case 'cyclones':
        return <CyclonesPage />;
      case 'rainfall':
        return <RainfallPage />;
      case 'agri':
        return <AgriPage />;
      case 'marine':
        return <MarinePage />;
      case 'aviation':
        return <AviationPage />;
      case 'climate':
        return <ClimatePage />;
      case 'admin':
        return <AdminPage />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'resources':
        return <ResourcesPage selectedLanguage={selectedLanguage} />;
      default:
        return <Dashboard onNavigate={setActiveTab} selectedLanguage={selectedLanguage} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'} flex flex-col transition-colors duration-200`}>
      {/* Top Fixed Header */}
      <Header
        onSearchSubmit={handleGlobalSearch}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLiveLocationChange={handleLiveLocationChange}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          selectedLanguage={selectedLanguage}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {renderActiveContent()}
        </main>
      </div>

      {/* Global Footer */}
      <Footer selectedLanguage={selectedLanguage} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        tempUnit={tempUnit}
        onTempUnitChange={setTempUnit}
        windUnit={windUnit}
        onWindUnitChange={setWindUnit}
      />

      {/* Login & User Access Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};
