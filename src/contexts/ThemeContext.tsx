'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Theme type definition
 */
export type ThemeName = 'dark' | 'light';

/**
 * Theme color configuration
 */
export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

/**
 * Complete theme configuration
 */
export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
}

/**
 * Theme context value
 */
interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

/**
 * Theme configurations
 */
const themes: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    colors: {
      bg: '#1e1e1e',
      bgSecondary: '#252526',
      bgTertiary: '#2d2d2d',
      text: '#d4d4d4',
      textSecondary: '#858585',
      textMuted: '#6a6a6a',
      accent: '#007acc',
      border: '#3e3e3e',
      success: '#4ec9b0',
      warning: '#dcdcaa',
      error: '#f48771'
    }
  },
  light: {
    name: 'light',
    colors: {
      bg: '#ffffff',
      bgSecondary: '#f3f3f3',
      bgTertiary: '#e8e8e8',
      text: '#1e1e1e',
      textSecondary: '#6a6a6a',
      textMuted: '#858585',
      accent: '#0066cc',
      border: '#d4d4d4',
      success: '#14a085',
      warning: '#b89500',
      error: '#e51400'
    }
  }
};

const THEME_STORAGE_KEY = 'vscode-portfolio-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Hook to access theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that manages theme state and persistence
 * 
 * Features:
 * - Theme state management (dark/light)
 * - localStorage persistence
 * - Theme restoration on page load
 * - CSS variable application
 * - Default to dark theme
 * 
 * Requirements: 8.3, 8.4, 8.5
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    
    // Try to load theme from localStorage
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeName(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }, []);

  // Apply theme to CSS variables whenever theme changes
  useEffect(() => {
    if (!mounted) return;

    const theme = themes[themeName];
    const root = document.documentElement;

    // Apply theme colors as CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Save theme to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }

    // Update data-theme attribute for CSS selectors
    root.setAttribute('data-theme', themeName);
  }, [themeName, mounted]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
  };

  const toggleTheme = () => {
    setThemeName(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextValue = {
    theme: themes[themeName],
    themeName,
    setTheme,
    toggleTheme
  };

  // Prevent flash of unstyled content by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
