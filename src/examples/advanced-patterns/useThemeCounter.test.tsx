/**
 * This test file demonstrates how to test advanced patterns that combine
 * custom hooks with context in Vitest with TypeScript.
 * 
 * KEY CONCEPTS:
 * 1. Testing hooks that depend on context
 * 2. Using wrapper components to provide context in tests
 * 3. Testing type discriminated behavior
 * 4. Testing with branded types
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, ThemeContext, ThemeContextType } from '../react-specific/context/ThemeContext';
import { useThemeCounter, UseThemeCounterOptions } from './useThemeCounter';

const createWrapper = (isDarkMode: boolean) => {
  const mockThemeContext: ThemeContextType = {
    mode: isDarkMode ? 'dark' : 'light',
    isDark: isDarkMode,
    setMode: vi.fn(),
    toggleTheme: vi.fn()
  };

  return ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={mockThemeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

describe('useThemeCounter Advanced Pattern', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Theme-dependent behavior', () => {
    it('should use darkModeStep in dark mode', async () => {
      const { result } = renderHook(() => useThemeCounter({ darkModeStep: 3 }), {
        wrapper: createWrapper(true)
      });

      expect(result.current.state.mode).toBe('dark');
      expect(result.current.state.isDarkMode).toBe(true);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.state.count).toBe(3);
      expect(console.log).toHaveBeenCalledWith('Incrementing in dark mode by 3');
    });

    it('should use lightModeStep in light mode', async () => {
      const { result } = renderHook(() => useThemeCounter({ lightModeStep: 5 }), {
        wrapper: createWrapper(false)
      });

      expect(result.current.state.mode).toBe('light');
      expect(result.current.state.isDarkMode).toBe(false);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.state.count).toBe(5);
      expect(console.log).toHaveBeenCalledWith('Incrementing in light mode by 5');
    });
  });

  describe('Type discrimination', () => {
    it('should provide type-safe access to state based on mode', () => {
      const { result } = renderHook(() => useThemeCounter(), {
        wrapper: createWrapper(true)
      });

      if (result.current.state.isDarkMode) {
        expect(result.current.state.mode).toBe('dark');
        
      } else {
        expect(result.current.state.mode).toBe('light');
      }
    });
  });

  describe('Error handling', () => {
    it('should handle invalid initial values', () => {
      const { result } = renderHook(() => useThemeCounter({ 
        initialValue: -10,
        min: 0 // This will constrain the value to min
      }), {
        wrapper: createWrapper(true)
      });

      expect(result.current.state.count).toBe(0);
    });

    it('should handle edge cases with max values', () => {
      const { result } = renderHook(() => useThemeCounter({ 
        initialValue: 8,
        max: 10,
        darkModeStep: 3
      }), {
        wrapper: createWrapper(true)
      });

      act(() => {
        result.current.increment();
      });

      expect(result.current.state.count).toBe(10);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.state.count).toBe(10);
    });
  });
});
