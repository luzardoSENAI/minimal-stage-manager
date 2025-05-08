
import React, { createContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type ColorTheme = "blue" | "green" | "orange";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (color: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorTheme: "blue",
  toggleTheme: () => {},
  setColorTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColor = localStorage.getItem("colorTheme") as ColorTheme;
    return savedColor || "blue";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("color-blue", "color-green", "color-orange");
    root.classList.add(`color-${colorTheme}`);
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
