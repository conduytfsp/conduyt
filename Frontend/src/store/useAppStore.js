import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create()(
  persist(
    (set, get) => ({
      mode: 'freelancer',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'freelancer' ? 'client' : 'freelancer' }),

      activeTab: 'profile',
      setActiveTab: (tab) => set({ activeTab: tab }),

      applicationFilter: 'all',
      setApplicationFilter: (filter) => set({ applicationFilter: filter }),
    }),
    { name: 'conduyt-app-store', partialize: (s) => ({ mode: s.mode }) },
  ),
);
