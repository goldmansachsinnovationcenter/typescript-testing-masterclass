/**
 * This test file demonstrates how to mock dynamic imports in Vitest
 * with TypeScript, focusing on avoiding hoisting-related errors.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Calculator } from './calculator';

const mockAdd = vi.fn();
const mockSubtract = vi.fn();
const mockMultiply = vi.fn();
const mockDivide = vi.fn();

vi.mock('./math-utils', () => {
  return {
    default: {
      add: mockAdd,
      subtract: mockSubtract,
      multiply: mockMultiply,
      divide: mockDivide
    },
    add: mockAdd,
    subtract: mockSubtract,
    multiply: mockMultiply,
    divide: mockDivide
  };
});

describe('Dynamic Imports Mocking', () => {
  let calculator: Calculator;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    calculator = new Calculator();
    
    mockAdd.mockImplementation((a, b) => a + b);
    mockSubtract.mockImplementation((a, b) => a - b);
    mockMultiply.mockImplementation((a, b) => a * b);
    mockDivide.mockImplementation((a, b) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    });
  });
  
  it('should mock dynamically imported add function', async () => {
    const a = 5;
    const b = 3;
    
    const result = await calculator.performOperation('add', a, b);
    
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith(a, b);
    expect(result).toBe(8);
  });
  
  it('should mock dynamically imported subtract function', async () => {
    const a = 10;
    const b = 4;
    
    const result = await calculator.performOperation('subtract', a, b);
    
    expect(mockSubtract).toHaveBeenCalledTimes(1);
    expect(mockSubtract).toHaveBeenCalledWith(a, b);
    expect(result).toBe(6);
  });
  
  it('should mock dynamically imported multiply function', async () => {
    const a = 7;
    const b = 6;
    
    const result = await calculator.performOperation('multiply', a, b);
    
    expect(mockMultiply).toHaveBeenCalledTimes(1);
    expect(mockMultiply).toHaveBeenCalledWith(a, b);
    expect(result).toBe(42);
  });
  
  it('should mock dynamically imported divide function', async () => {
    const a = 20;
    const b = 4;
    
    const result = await calculator.performOperation('divide', a, b);
    
    expect(mockDivide).toHaveBeenCalledTimes(1);
    expect(mockDivide).toHaveBeenCalledWith(a, b);
    expect(result).toBe(5);
  });
  
  it('should handle errors from mocked functions', async () => {
    const a = 10;
    const b = 0;
    
    await expect(calculator.performOperation('divide', a, b)).rejects.toThrow('Division by zero');
    expect(mockDivide).toHaveBeenCalledTimes(1);
    expect(mockDivide).toHaveBeenCalledWith(a, b);
  });
  
  it('should allow changing mock implementation for specific tests', async () => {
    mockAdd.mockImplementationOnce(() => 42);
    
    const result = await calculator.performOperation('add', 2, 2);
    
    expect(result).toBe(42);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });
});
