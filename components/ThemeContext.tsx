// ThemeContext.tsx
import { Colors } from "@/constants/Colors";
import React, { createContext, ReactNode, useContext } from "react";
import { useColorScheme } from "react-native";

type Theme = typeof Colors.light;

interface ThemeContextValue {
  theme: Theme;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <ThemeContext.Provider value={{ theme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
