'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themeConfig, ThemeConfig } from '@/config/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setTheme: (theme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(themeConfig);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default light mode

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Default to light mode if no preference is saved
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
    } else if (savedDarkMode === null) {
      // If no preference is saved, default to light mode
      localStorage.setItem('darkMode', 'false');
      setIsDarkMode(false);
    }
    
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState({ ...themeConfig, ...parsedTheme });
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document using Vuexy template classes
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.remove('light-style');
      htmlElement.classList.add('dark-style');
    } else {
      htmlElement.classList.remove('dark-style');
      htmlElement.classList.add('light-style');
    }
    
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setThemeState(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleDarkMode,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 