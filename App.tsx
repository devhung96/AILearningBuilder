import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Roadmap } from './types';
import { generateRoadmap as generateGeminiRoadmap } from './services/geminiService';
import { generateRoadmap as generateOpenRouterRoadmap } from './services/openRouterService';
import { useRoadmapStore } from './store/roadmapStore';
import LandingPage from './components/LandingPage';
import RoadmapView from './components/RoadmapView';

export type ModelProvider = 'gemini' | 'openrouter';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<string>('');
  const [model, setModel] = useState<ModelProvider>('gemini');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const { addRoadmapToHistory } = useRoadmapStore();

  const generateRoadmapMutation = useMutation({
    mutationFn: (variables: { topic: string; model: ModelProvider }) => {
      if (variables.model === 'gemini') {
        return generateGeminiRoadmap(variables.topic);
      } else {
        return generateOpenRouterRoadmap(variables.topic);
      }
    },
    onSuccess: (data: Roadmap) => {
      if (data && data.chapters && data.chapters.length > 0) {
        setRoadmap(data);
        setSelectedChapterId(data.chapters[0].id);
        addRoadmapToHistory(data);
        setError(null);
      } else {
        setError(t('errorNoRoadmap'));
      }
    },
    onError: (err: Error) => {
      setError(err.message || t('errorGeneric'));
      console.error(err);
    },
  });

  const handleGenerateRoadmap = useCallback(() => {
    if (!topic.trim()) {
      setError(t('errorTopic'));
      return;
    }
    setError(null);
    setRoadmap(null);
    setSelectedChapterId(null);
    generateRoadmapMutation.mutate({ topic, model });
  }, [topic, model, generateRoadmapMutation, t]);

  const handleToggleChapterComplete = useCallback((chapterId: string) => {
    setRoadmap(prevRoadmap => {
      if (!prevRoadmap) return null;
      
      const newChapters = prevRoadmap.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return { ...chapter, isCompleted: !chapter.isCompleted };
        }
        return chapter;
      });

      const newRoadmap = { ...prevRoadmap, chapters: newChapters };
      // Also update history
      addRoadmapToHistory(newRoadmap);
      return newRoadmap;
    });
  }, [addRoadmapToHistory]);

  const handleReset = () => {
    setTopic('');
    setRoadmap(null);
    setError(null);
    setSelectedChapterId(null);
    generateRoadmapMutation.reset();
  };
  
  const handleLoadFromHistory = (historicRoadmap: Roadmap) => {
    setRoadmap(historicRoadmap);
    setSelectedChapterId(historicRoadmap.chapters[0]?.id || null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {!roadmap ? (
        <LandingPage
          topic={topic}
          setTopic={setTopic}
          model={model}
          setModel={setModel}
          onGenerate={handleGenerateRoadmap}
          isLoading={generateRoadmapMutation.isPending}
          error={error}
        />
      ) : (
        <RoadmapView
          roadmap={roadmap}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
          onToggleChapterComplete={handleToggleChapterComplete}
          onReset={handleReset}
          onLoadFromHistory={handleLoadFromHistory}
        />
      )}
    </div>
  );
};

export default App;