/**
 * This test file demonstrates how to test custom React hooks in Vitest
 * with TypeScript, focusing on testing hook behavior and state changes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter, UseCounterOptions } from './useCounter';

describe('useCounter Hook', () => {
  describe('Basic Functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCounter());
      
      expect(result.current.count).toBe(0);
    });
    
    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => useCounter({ initialValue: 10 }));
      
      expect(result.current.count).toBe(10);
    });
    
    it('should increment the counter', () => {
      const { result } = renderHook(() => useCounter());
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(1);
    });
    
    it('should decrement the counter', () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5 }));
      
      act(() => {
        result.current.decrement();
      });
      
      expect(result.current.count).toBe(4);
    });
    
    it('should reset the counter to initial value', () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5 }));
      
      act(() => {
        result.current.increment();
        result.current.increment();
      });
      
      expect(result.current.count).toBe(7);
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.count).toBe(5);
    });
    
    it('should set the counter to a specific value', () => {
      const { result } = renderHook(() => useCounter());
      
      act(() => {
        result.current.setValue(42);
      });
      
      expect(result.current.count).toBe(42);
    });
  });
  
  describe('Advanced Options', () => {
    it('should respect the min value', () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5, min: 0 }));
      
      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });
      
      expect(result.current.count).toBe(0);
      
      act(() => {
        result.current.decrement();
      });
      
      expect(result.current.count).toBe(0);
    });
    
    it('should respect the max value', () => {
      const { result } = renderHook(() => useCounter({ initialValue: 8, max: 10 }));
      
      act(() => {
        result.current.increment();
        result.current.increment();
      });
      
      expect(result.current.count).toBe(10);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(10);
    });
    
    it('should use the provided step value', () => {
      const { result } = renderHook(() => useCounter({ step: 5 }));
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(5);
      
      act(() => {
        result.current.decrement();
      });
      
      expect(result.current.count).toBe(0);
    });
  });
  
  describe('Hook Rerendering', () => {
    it('should update when options change', () => {
      const initialProps: UseCounterOptions = { initialValue: 0, step: 1 };
      const { result, rerender } = renderHook((props) => useCounter(props), {
        initialProps
      });
      
      expect(result.current.count).toBe(0);
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(1);
      
      rerender({ initialValue: 0, step: 10 });
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(11);
    });
    
    it('should not reset count when rerendered with same initialValue', () => {
      const { result, rerender } = renderHook((props) => useCounter(props), {
        initialProps: { initialValue: 5 }
      });
      
      act(() => {
        result.current.increment();
      });
      
      expect(result.current.count).toBe(6);
      
      rerender({ initialValue: 5 });
      
      expect(result.current.count).toBe(6);
    });
  });
});
