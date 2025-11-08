
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chapter, Roadmap } from '../types';
import { useRoadmapStore } from '../store/roadmapStore';
import CheckIcon from './icons/CheckIcon';
import ClockIcon from './icons/ClockIcon';

interface SidebarProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onToggleChapterComplete: (id: string) => void;
  onLoadFromHistory: (roadmap: Roadmap) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, selectedChapterId, onSelectChapter, onToggleChapterComplete, onLoadFromHistory, isSidebarOpen, setIsSidebarOpen }) => {
  const { t } = useTranslation();
  const { history } = useRoadmapStore();

  const handleSelect = (callback: () => void) => {
    callback();
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false);
    }
  }

  const sidebarContent = (
    <div className='h-full flex flex-col'>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">{t('chapters')}</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} className="my-1">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleSelect(() => onSelectChapter(chapter.id)); }}
                className={`group flex items-center w-full p-3 rounded-md transition-all duration-200 ${selectedChapterId === chapter.id
                    ? 'bg-purple-600/30 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
              >
                <div
                  onClick={(e) => { e.stopPropagation(); onToggleChapterComplete(chapter.id); }}
                  className={`flex-shrink-0 w-6 h-6 mr-3 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-200 ${chapter.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-purple-400'
                    }`}
                >
                  {chapter.isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <span className={`flex-1 ${chapter.isCompleted ? 'line-through text-gray-400' : ''}`}>
                  {index + 1}. {chapter.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {history.length > 0 && (
         <>
            <div className="p-4 border-t border-gray-700">
                <h2 className="text-2xl font-bold">{t('history')}</h2>
            </div>
            <nav className="overflow-y-auto p-2">
                <ul>
                    {history.map((roadmap) => (
                        <li key={roadmap.topic} className="my-1">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleSelect(() => onLoadFromHistory(roadmap))}}
                                className="group flex items-center w-full p-3 rounded-md text-gray-300 hover:bg-gray-700/50 transition-colors"
                            >
                                <ClockIcon className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
                                <span className="flex-1 truncate">{roadmap.topic}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
         </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-40 w-72 h-full bg-gray-800 shadow-lg transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 flex-shrink-0 bg-gray-800 border-r border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
