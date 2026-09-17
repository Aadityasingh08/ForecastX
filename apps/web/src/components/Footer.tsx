import React from 'react';
import { getTranslation } from '@/i18n/translations';

interface FooterProps {
  selectedLanguage?: string;
}

export const Footer: React.FC<FooterProps> = ({ selectedLanguage = 'en' }) => {
  const t = getTranslation(selectedLanguage);

  return (
    <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm py-3.5 px-4 lg:px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#0f2942] dark:text-slate-100">ForecastX</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {t.brand_tagline}
          </span>
        </div>

        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap justify-center">
          <span>{t.footer_powered_by}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <span>🇮🇳</span>
          <span>{t.footer_mission}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            {t.footer_made_by.includes(':') ? (
              <>
                {t.footer_made_by.split(':')[0]}:{' '}
                <a
                  href="https://github.com/Aadityasingh08"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t.footer_made_by.split(':')[1]?.trim() || 'Aditya Singh'}
                </a>
              </>
            ) : (
              <>
                Made by{' '}
                <a
                  href="https://github.com/Aadityasingh08"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Aditya Singh
                </a>
              </>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
};
