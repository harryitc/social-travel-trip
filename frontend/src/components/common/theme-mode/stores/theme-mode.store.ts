import { LocalStorageConfigKeys } from '@/config/app-storage/local-storage.config';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TThemeModeStore = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const useThemeModeStore = create<TThemeModeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          document.documentElement.classList.toggle('dark');
          return {
            isDarkMode: !state.isDarkMode,
          };
        }),
    }),
    {
      name: LocalStorageConfigKeys.global.theme_mode, // Tên key trong sessionStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
