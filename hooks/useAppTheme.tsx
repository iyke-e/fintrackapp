import { useThemeStore } from "@/store/useThemeStore";
import { darkTheme, lightTheme } from "@/theme/colors";

export const useAppTheme = () => {
  // get the current theme color from the store
  const isDark = useThemeStore((state) => state.isDarkMode);

  // set the theme color based on the current theme gotten from the store
  return isDark ? darkTheme : lightTheme;
};
