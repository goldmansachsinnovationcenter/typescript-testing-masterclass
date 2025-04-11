/**
 * This file demonstrates an advanced pattern combining a custom hook with context.
 * It creates a counter hook that changes behavior based on the current theme.
 */
import { useCallback } from 'react';
import { useTheme } from '../react-specific/context/ThemeContext';
import { useCounter, UseCounterOptions } from '../react-specific/hooks/useCounter';

export type DarkModeCount = number & { readonly __brand: unique symbol };
export type LightModeCount = number & { readonly __brand: unique symbol };

export type ThemeCounterState = 
  | { mode: 'dark'; count: DarkModeCount; isDarkMode: true }
  | { mode: 'light'; count: LightModeCount; isDarkMode: false };

export interface UseThemeCounterOptions extends UseCounterOptions {
  darkModeStep?: number;
  lightModeStep?: number;
}

export interface UseThemeCounterReturn {
  state: ThemeCounterState;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

/**
 * A custom hook that combines the useCounter hook with the ThemeContext.
 * The counter behavior changes based on the current theme:
 * - In dark mode, it uses the darkModeStep for increments/decrements
 * - In light mode, it uses the lightModeStep for increments/decrements
 */
export const useThemeCounter = (options: UseThemeCounterOptions = {}): UseThemeCounterReturn => {
  const { 
    darkModeStep = 2, 
    lightModeStep = 1,
    ...counterOptions 
  } = options;
  
  const { isDark } = useTheme();
  
  const { count, increment: baseIncrement, decrement: baseDecrement, reset, setValue } = useCounter({
    ...counterOptions,
    step: isDark ? darkModeStep : lightModeStep
  });
  
  const state: ThemeCounterState = isDark 
    ? { mode: 'dark', count: count as DarkModeCount, isDarkMode: true }
    : { mode: 'light', count: count as LightModeCount, isDarkMode: false };
  
  const increment = useCallback(() => {
    console.log(`Incrementing in ${isDark ? 'dark' : 'light'} mode by ${isDark ? darkModeStep : lightModeStep}`);
    baseIncrement();
  }, [isDark, darkModeStep, lightModeStep, baseIncrement]);
  
  const decrement = useCallback(() => {
    console.log(`Decrementing in ${isDark ? 'dark' : 'light'} mode by ${isDark ? darkModeStep : lightModeStep}`);
    baseDecrement();
  }, [isDark, darkModeStep, lightModeStep, baseDecrement]);
  
  return {
    state,
    increment,
    decrement,
    reset,
    setValue
  };
};

export default useThemeCounter;
