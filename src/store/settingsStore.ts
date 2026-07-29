import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColumnMapping } from '../types/contact';

interface SettingsState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lastMapping: ColumnMapping | null;
  setLastMapping: (mapping: ColumnMapping) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      lastMapping: null,
      setLastMapping: (mapping) => set({ lastMapping: mapping }),
    }),
    { name: 'broadcast-builder-settings' }
  )
);
