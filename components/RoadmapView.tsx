
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Roadmap } from '../types';
import Sidebar from './Sidebar';
import ChapterContent from './ChapterContent';
import LanguageSwitcher from './LanguageSwitcher';

interface RoadmapViewProps {
  roadmap: Roadmap;
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onToggleChapterComplete: (id:string) => void;
  onReset: () => void;
  onLoadFromHistory: (roadmap: Roadmap) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, selectedChapterId, onSelectChapter, onToggleChapterComplete, onReset, onLoadFromHistory }) => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedChapter = roadmap.chapters.find(c => c.id === selectedChapterId);

  const completedCount = roadmap.chapters.filter(c => c.isCompleted).length;
  const totalCount = roadmap.chapters.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
       <Sidebar 
          chapters={roadmap.chapters}
          selectedChapterId={selectedChapterId}
          onSelectChapter={onSelectChapter}
          onToggleChapterComplete={onToggleChapterComplete}
          onLoadFromHistory={onLoadFromHistory}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
       />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-gray-800/50 border-b border-gray-700 shadow-md z-10 gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 rounded-md hover:bg-gray-700">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className='flex-1 md:text-center'>
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 truncate">
              {t('yourRoadmapFor', { topic: '' })} <span className="text-white">{roadmap.topic}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
            >
              {t('newTopicButton')}
            </button>
          </div>
        </header>

         <div className="w-full p-4 bg-gray-800/50 border-b border-gray-700">
            <p className="text-sm text-gray-400 mb-1">{t('progress', { completedCount, totalCount })}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{width: `${progressPercentage}%`}}
                ></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {selectedChapter ? (
                <ChapterContent chapter={selectedChapter} />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-xl text-gray-500">{t('selectChapterPrompt')}</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default RoadmapView;
