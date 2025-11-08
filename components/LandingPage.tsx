
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModelProvider } from '../App';
import LanguageSwitcher from './LanguageSwitcher';

interface LandingPageProps {
  topic: string;
  setTopic: (topic: string) => void;
  model: ModelProvider;
  setModel: (model: ModelProvider) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const ModelSelector: React.FC<{ model: ModelProvider; setModel: (model: ModelProvider) => void; }> = ({ model, setModel }) => {
    const { t } = useTranslation();
    return (
        <div className="my-6">
            <p className="text-center text-gray-300 mb-3">{t('modelSelector')}</p>
            <div className="flex justify-center items-center space-x-4 bg-gray-800/50 border-2 border-gray-700 rounded-full p-1 max-w-sm mx-auto">
                <button 
                    onClick={() => setModel('gemini')} 
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${model === 'gemini' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    {t('gemini')}
                </button>
                <button 
                    onClick={() => setModel('openrouter')} 
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${model === 'openrouter' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                    {t('openrouter')}
                </button>
            </div>
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ topic, setTopic, model, setModel, onGenerate, isLoading, error }) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-indigo-900/50">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
          {t('appName')}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          {t('appDescription')}
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('placeholder')}
            className="w-full px-6 py-4 text-lg text-white bg-gray-800/50 border-2 border-gray-700 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !topic.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              t('generateButton')
            )}
          </button>
        </div>

        <ModelSelector model={model} setModel={setModel} />
        
        {error && <p className="mt-4 text-red-400 animate-pulse">{error}</p>}
      </div>
    </div>
  );
};

export default LandingPage;
