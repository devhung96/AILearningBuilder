
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'vi', name: 'VI' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-700/50 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
            i18n.resolvedLanguage === lang.code
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          aria-label={`Switch to ${lang.name}`}
          aria-pressed={i18n.resolvedLanguage === lang.code}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
