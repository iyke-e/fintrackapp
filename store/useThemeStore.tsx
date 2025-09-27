import { Appearance } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

// detect system default once (used only on first install)
const systemTheme = Appearance.getColorScheme() === "dark";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: systemTheme,

      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      setTheme: (dark) => set({ isDarkMode: dark }),
    }),
    {
      name: "theme-storage", // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
