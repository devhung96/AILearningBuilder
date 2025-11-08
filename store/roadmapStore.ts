
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Roadmap } from '../types';

interface RoadmapState {
  history: Roadmap[];
  addRoadmapToHistory: (roadmap: Roadmap) => void;
  clearHistory: () => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      history: [],
      addRoadmapToHistory: (roadmap) =>
        set((state) => ({
          history: [roadmap, ...state.history.filter(r => r.topic.toLowerCase() !== roadmap.topic.toLowerCase())].slice(0, 10), // Keep latest 10
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'roadmap-history-storage',
    }
  )
);
