import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
};

type ThemeActions = {
  setTheme: (theme: Theme) => void;
};

const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: Theme) => set({ theme: theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

export const selectTheme = (state: ThemeState) => state.theme;
export const selectSetTheme = (state: ThemeActions) => state.setTheme;

export default useThemeStore;
