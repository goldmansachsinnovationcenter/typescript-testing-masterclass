/**
 * Example custom hook for counter functionality
 */
import { useState, useCallback } from 'react';

export interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

export const useCounter = (options: UseCounterOptions = {}): UseCounterReturn => {
  const {
    initialValue = 0,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    step = 1
  } = options;
  
  const [count, setCount] = useState<number>(initialValue);
  
  const increment = useCallback(() => {
    setCount(currentCount => {
      const newValue = currentCount + step;
      return newValue <= max ? newValue : currentCount;
    });
  }, [max, step]);
  
  const decrement = useCallback(() => {
    setCount(currentCount => {
      const newValue = currentCount - step;
      return newValue >= min ? newValue : currentCount;
    });
  }, [min, step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);
  
  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
};

export default useCounter;
