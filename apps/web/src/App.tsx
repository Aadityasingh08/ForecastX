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
import { SettingsModal } from '@/pages/SettingsModal';
import { LoginModal } from '@/components/LoginModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItemId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-[#0f2942]">
              Meteorological Reference Documents & Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">IMD AWS Data Schema & API Guide</h4>
                <p className="text-slate-500">Official protocol specs for Synoptic and Automatic Weather Stations.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">OASIS Common Alerting Protocol (CAP v1.2)</h4>
                <p className="text-slate-500">Standard XML/JSON schema for public safety alert dissemination.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">WMO WIS2 Architecture Overview</h4>
                <p className="text-slate-500">World Meteorological Organization global data exchange standards.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900">ISRO MOSDAC Satellite Ingestion</h4>
                <p className="text-slate-500">INSAT-3DR and Oceansat sensor processing pipelines.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveTab} selectedLanguage={selectedLanguage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Fixed Header */}
      <Header
        onSearchSubmit={handleGlobalSearch}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
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
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {renderActiveContent()}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
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
