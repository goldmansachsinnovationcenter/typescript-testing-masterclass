/**
 * This file demonstrates common testing issues and their solutions
 * with practical examples that can be run to see the problems and fixes.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('./example-module', () => ({
  exampleFunction: vi.fn().mockReturnValue('mocked value'),
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked data' }),
}));

import { exampleFunction, fetchData } from './example-module';

describe('Hoisting Example', () => {
  it('demonstrates correct mock hoisting', () => {
    const result = exampleFunction();
    expect(result).toBe('mocked value');
    expect(exampleFunction).toHaveBeenCalled();
  });
});


describe('Async Testing Issues', () => {
  it.skip('incorrect: might pass even when it should fail', () => {
    const promise = Promise.resolve(false);
    expect(promise).resolves.toBe(true); // This won't fail as expected!
  });

  it('correct: using async/await', async () => {
    const promise = Promise.resolve(true);
    await expect(promise).resolves.toBe(true);
  });

  it('correct: returning the promise', () => {
    const promise = Promise.resolve(true);
    return expect(promise).resolves.toBe(true);
  });

  it.skip('incorrect: unhandled rejection', async () => {
    const promise = Promise.reject(new Error('Something went wrong'));
    await promise; // This will cause an unhandled rejection
    expect(true).toBe(true); // This line won't execute
  });

  it('correct: expecting rejection', async () => {
    const promise = Promise.reject(new Error('Something went wrong'));
    await expect(promise).rejects.toThrow('Something went wrong');
  });
});


describe('Timer Mocking Issues', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.skip('incorrect: waiting for real timers', async () => {
    let value = false;
    setTimeout(() => {
      value = true;
    }, 1000);

    
    expect(value).toBe(true); // This will fail because the timer hasn't executed
  });

  it('correct: using fake timers', () => {
    let value = false;
    setTimeout(() => {
      value = true;
    }, 1000);

    vi.advanceTimersByTime(1000);
    expect(value).toBe(true);
  });

  it.skip('incorrect: nested timers not fully advanced', () => {
    let value = 0;
    
    setTimeout(() => {
      value = 1;
      setTimeout(() => {
        value = 2;
      }, 1000);
    }, 1000);

    vi.advanceTimersByTime(1000); // Only advances the first timer
    expect(value).toBe(2); // This will fail because the second timer hasn't executed
  });

  it('correct: running all timers', () => {
    let value = 0;
    
    setTimeout(() => {
      value = 1;
      setTimeout(() => {
        value = 2;
      }, 1000);
    }, 1000);

    vi.runAllTimers(); // Runs all timers regardless of nesting
    expect(value).toBe(2);
  });
});


describe('Mock Implementation Issues', () => {
  it.skip('incorrect: mock implementation type mismatch', async () => {
    const mockFetch = vi.fn().mockReturnValue('data'); // Returns string instead of Promise
    
    await mockFetch().then(data => {
      expect(data).toBe('data');
    });
  });

  it('correct: matching the function signature', async () => {
    const mockFetch = vi.fn().mockResolvedValue('data'); // Returns Promise<string>
    
    const result = await mockFetch();
    expect(result).toBe('data');
  });

  it.skip('incorrect: incomplete mock implementation', () => {
    const mockProcessor = vi.fn().mockImplementation((value) => {
      return `processed: ${value}`;
    });
    
    expect(mockProcessor('data')).toBe('processed: data');
    expect(mockProcessor(null)).toBe('error'); // This will fail
  });

  it('correct: complete mock implementation', () => {
    const mockProcessor = vi.fn().mockImplementation((value) => {
      if (value === null || value === undefined) {
        return 'error';
      }
      return `processed: ${value}`;
    });
    
    expect(mockProcessor('data')).toBe('processed: data');
    expect(mockProcessor(null)).toBe('error');
  });
});


describe('Spy Reset Issues', () => {
  let mockFunction: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    mockFunction = vi.fn();
  });

  it('first test calls the mock', () => {
    mockFunction('first call');
    expect(mockFunction).toHaveBeenCalledWith('first call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('second test expects the mock not to have been called', () => {
    expect(mockFunction).not.toHaveBeenCalled();
    
    mockFunction('second call');
    expect(mockFunction).toHaveBeenCalledWith('second call');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('third test with explicit reset', () => {
    mockFunction('call before reset');
    expect(mockFunction).toHaveBeenCalled();
    
    mockFunction.mockReset();
    
    expect(mockFunction).not.toHaveBeenCalled();
    mockFunction('call after reset');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});


describe('Debugging Techniques', () => {
  it('using console.log for debugging', () => {
    const complexObject = {
      name: 'test',
      nested: {
        value: 42,
        items: [1, 2, 3]
      }
    };
    
    
    expect(complexObject.nested.value).toBe(42);
  });

  it('using debugger statement', () => {
    const calculate = (a: number, b: number): number => {
      const result = a * b;
      
      
      return result;
    };
    
    const result = calculate(6, 7);
    expect(result).toBe(42);
  });
});


describe('Performance Optimization', () => {
  it('demonstrates focused testing with .only', () => {
    
    expect(true).toBe(true);
  });

  it('demonstrates skipping slow tests', () => {
    
    expect(true).toBe(true);
  });
});
