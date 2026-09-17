import React from 'react';
import { CloudRain, CloudSun, Wind, CloudLightning, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { CurrentWeather } from '@/types';
import { getTranslation } from '@/i18n/translations';

interface CityStripProps {
  cities: CurrentWeather[];
  onSelectCity: (city: CurrentWeather) => void;
  onViewMore: () => void;
  selectedLanguage?: string;
}

export const CityStrip: React.FC<CityStripProps> = ({
  cities,
  onSelectCity,
  onViewMore,
  selectedLanguage = 'en',
}) => {
  const t = getTranslation(selectedLanguage);

  const getConditionIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('thunder')) return <CloudLightning className="w-6 h-6 text-amber-500 fill-amber-100" />;
    if (c.includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500 fill-blue-100" />;
    if (c.includes('haze') || c.includes('fog')) return <Wind className="w-6 h-6 text-slate-400" />;
    return <CloudSun className="w-6 h-6 text-amber-500 fill-amber-100" />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cities.slice(0, 4).map((city) => (
        <div
          key={city.location_id}
          onClick={() => onSelectCity(city)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 rounded-xl transition-colors">
              {getConditionIcon(city.condition)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f2942] dark:text-slate-100 tracking-tight">{city.city_name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{city.condition}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-[#0f2942] dark:text-slate-100 leading-tight">
              {Math.round(city.temperature)}°C
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
              <span className="flex items-center text-slate-600 dark:text-slate-300">
                <ArrowUp className="w-2.5 h-2.5 text-red-500" />
                {Math.round(city.temp_max)}°
              </span>
              <span className="flex items-center text-slate-500 dark:text-slate-400">
                <ArrowDown className="w-2.5 h-2.5 text-blue-500" />
                {Math.round(city.temp_min)}°
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* View More Cities Button Card */}
      <button
        onClick={onViewMore}
        className="bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800 rounded-2xl p-3.5 transition-all flex items-center justify-center gap-2 group text-xs font-bold text-blue-700 dark:text-blue-300 shadow-sm"
      >
        <span>{t.view_more_cities}</span>
        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
          <ChevronRight className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />
        </div>
      </button>
    </div>
  );
};
