/**
 * Example context provider for theme management
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
  systemIsDark?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'system',
  systemIsDark = false
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  
  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark);
  
  const toggleTheme = useCallback(() => {
    setMode(prevMode => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'light';
      return systemIsDark ? 'light' : 'dark';
    });
  }, [systemIsDark]);
  
  const value = {
    mode,
    isDark,
    setMode,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
