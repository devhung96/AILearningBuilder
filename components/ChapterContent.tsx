
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chapter, Resource } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ChapterContentProps {
  chapter: Chapter;
}

const ResourceIcon: React.FC<{ type: Resource['type'] }> = ({ type }) => {
  const iconClasses = "w-5 h-5 mr-3 text-purple-400";
  switch (type) {
    case 'video':
      return <VideoCameraIcon className={iconClasses} />;
    case 'article':
      return <DocumentTextIcon className={iconClasses} />;
    case 'documentation':
      return <BookOpenIcon className={iconClasses} />;
    case 'book':
      return <BookOpenIcon className={iconClasses} />;
    case 'interactive':
        return <CodeBracketIcon className={iconClasses} />;
    default:
      return <ChevronRightIcon className={iconClasses} />;
  }
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-2xl font-semibold mb-4 text-purple-300">{title}</h3>
        {children}
    </div>
);

const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8 pb-4 border-b-2 border-purple-500/30">
            <h2 className="text-4xl font-bold mb-2">{chapter.title}</h2>
            <p className="text-lg text-gray-400">{chapter.description}</p>
        </div>

        <Section title={t('learningObjectives')}>
            <ul className="list-none space-y-2">
                {chapter.learningObjectives.map((obj, index) => (
                    <li key={index} className="flex items-start">
                        <ChevronRightIcon className="w-5 h-5 mt-1 mr-2 text-cyan-400 flex-shrink-0" />
                        <span>{obj}</span>
                    </li>
                ))}
            </ul>
        </Section>

        <Section title={t('keyConcepts')}>
            <div className="flex flex-wrap gap-2">
                {chapter.keyConcepts.map((concept, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-cyan-300 rounded-full text-sm font-medium">
                        {concept}
                    </span>
                ))}
            </div>
        </Section>
        
        <Section title={t('resources')}>
            <div className="space-y-3">
                {chapter.resources.map((res, index) => (
                    <a
                        key={index}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-900/50 rounded-md border border-transparent hover:border-purple-500 hover:bg-gray-800 transition-all"
                    >
                        <ResourceIcon type={res.type} />
                        <div className="flex-1">
                            <p className="font-semibold">{res.title}</p>
                            <p className="text-xs text-gray-400 capitalize">{t(`resourceType.${res.type}`, res.type)}</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    </a>
                ))}
            </div>
        </Section>

        <Section title={t('exercises')}>
            <ul className="list-none space-y-4">
                {chapter.exercises.map((ex, index) => (
                    <li key={index} className="p-4 bg-gray-900/50 rounded-md">
                        <p className="mb-1">{ex.description}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            ex.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                            ex.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                        }`}>
                            {t(`difficulty.${ex.difficulty}`, ex.difficulty)}
                        </span>
                    </li>
                ))}
            </ul>
        </Section>
    </div>
  );
};

export default ChapterContent;
