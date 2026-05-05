import React, { createContext, useContext, useState, ReactNode } from 'react';
import fr from './locales/fr.json';
import en from './locales/en.json';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const translations: Record<Language, any> = { fr, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'fr'
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Helper to get nested keys like "nav.explore" with optional variable interpolation
  const t = (keyPath: string, variables?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let result = translations[language];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return keyPath; // Return key if not found
      }
    }

    if (typeof result !== 'string') return keyPath;

    // Replace {{variable}} placeholders
    if (variables) {
      return result.replace(/\{\{(\w+)\}\}/g, (_: string, varName: string) => {
        return variables[varName] !== undefined ? String(variables[varName]) : `{{${varName}}}`;
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
