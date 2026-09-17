import React, { useState, useEffect } from 'react';
import { CityStrip } from '@/components/CityStrip';
import { WeatherMap } from '@/components/WeatherMap';
import { AskForecastX } from '@/components/AskForecastX';
import { ActiveWarningsCard } from '@/components/ActiveWarningsCard';
import { CycloneTrackingCard } from '@/components/CycloneTrackingCard';
import { QuickAccessCard } from '@/components/QuickAccessCard';
import { NavItemId } from '@/components/Sidebar';
import { fetchTopCitiesStrip, fetchActiveWarnings, fetchCyclones } from '@/services/api';
import { CurrentWeather, CAPWarning, CycloneData } from '@/types';

interface DashboardProps {
  onNavigate: (tab: NavItemId) => void;
  selectedLanguage: string;
  initialChatQuery?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  selectedLanguage,
  initialChatQuery,
}) => {
  const [cities, setCities] = useState<CurrentWeather[]>([]);
  const [warnings, setWarnings] = useState<CAPWarning[]>([]);
  const [cyclone, setCyclone] = useState<CycloneData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchTopCitiesStrip().catch(() => []),
      fetchActiveWarnings().catch(() => []),
      fetchCyclones().catch(() => []),
    ]).then(([citiesData, warningsData, cyclonesData]) => {
      setCities(citiesData);
      setWarnings(warningsData);
      if (cyclonesData.length > 0) {
        setCyclone(cyclonesData[0]);
      }
      setIsLoading(false);
    });
  }, []);

  const handleCitySelect = (city: CurrentWeather) => {
    onNavigate('search');
  };

  return (
    <div className="space-y-4">
      {/* Top Flagship City Cards Strip */}
      <CityStrip
        cities={cities}
        onSelectCity={handleCitySelect}
        onViewMore={() => onNavigate('search')}
      />

      {/* Main Grid: Interactive Map (Left) + Ask ForecastX (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weather Map (7 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-7">
          <WeatherMap
            cyclones={cyclone ? [cyclone] : []}
            warnings={warnings}
            onSelectCity={(name) => onNavigate('search')}
          />
        </div>

        {/* Ask ForecastX AI Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <AskForecastX
            currentLanguage={selectedLanguage}
            initialQuery={initialChatQuery}
          />
        </div>
      </div>

      {/* Bottom Grid: Active Warnings + Cyclone Tracking + Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActiveWarningsCard
          warnings={warnings}
          onViewAll={() => onNavigate('warnings')}
          onSelectWarning={() => onNavigate('warnings')}
        />

        <CycloneTrackingCard
          cyclone={cyclone}
          onViewDetails={() => onNavigate('cyclones')}
        />

        <QuickAccessCard onNavigate={onNavigate} />
      </div>
    </div>
  );
};
