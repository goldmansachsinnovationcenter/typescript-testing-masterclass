/**
 * This test file demonstrates how to test React components that use Suspense and ErrorBoundary
 * with Vitest and Testing Library, focusing on mocking async data fetching.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  UserProfile, 
  UserDetails, 
  LoadingFallback, 
  ErrorBoundary,
  ErrorFallback,
  createResource, 
  api 
} from './DataFetcher';

describe('React Suspense and ErrorBoundary Testing', () => {
  vi.spyOn(api, 'fetchUser');
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    (api.fetchUser as any).mockImplementation(async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (id === 0) {
        throw new Error('User not found');
      }
      
      return { id, name: `User ${id}` };
    });
  });
  
  afterEach(() => {
    vi.clearAllTimers();
  });
  
  describe('Testing Individual Components', () => {
    it('should render UserDetails with provided resource', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const promise = Promise.resolve(mockUser);
      const resource = createResource(promise);
      
      await promise;
      
      render(<UserDetails resource={resource} />);
      
      expect(screen.getByTestId('user-details')).toBeInTheDocument();
      expect(screen.getByTestId('user-id')).toHaveTextContent('ID: 1');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: Test User');
    });
    
    it('should render LoadingFallback correctly', () => {
      render(<LoadingFallback />);
      
      expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    it('should render ErrorBoundary fallback when an error occurs', () => {
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      const TestComponent = () => {
        throw new Error('Test error');
      };
      
      render(
        <ErrorFallback 
          error={new Error('Test error')} 
          resetErrorBoundary={() => {}} 
        />
      );
      
      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      
      console.error = originalConsoleError;
    });
    
    it('should call onReset when retry button is clicked', () => {
      const handleReset = vi.fn();
      
      render(
        <ErrorFallback 
          error={new Error('Test error')} 
          resetErrorBoundary={handleReset} 
        />
      );
      
      fireEvent.click(screen.getByTestId('retry-button'));
      
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Testing Suspense with Fast Promises', () => {
    it('should render UserDetails after resource resolves', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const promise = Promise.resolve(mockUser);
      const resource = createResource(promise);
      
      await promise;
      
      const { act } = await import('react');
      
      await act(async () => {
        render(
          <Suspense fallback={<LoadingFallback />}>
            <UserDetails resource={resource} />
          </Suspense>
        );
      });
      
      expect(screen.getByTestId('user-details')).toBeInTheDocument();
      expect(screen.getByTestId('user-id')).toHaveTextContent('ID: 1');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: Test User');
    });
  });
  
  describe('Testing Complete UserProfile Component', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    
    afterEach(() => {
      vi.useRealTimers();
    });
    
    it('should initially show loading state and then user details', async () => {
      const { act } = await import('react');
      
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      await act(async () => {
        render(<UserProfile />);
      });
      
      expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-details')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      expect(screen.getByTestId('user-id')).toHaveTextContent('ID: 1');
      expect(api.fetchUser).toHaveBeenCalledWith(1);
      
      console.error = originalConsoleError;
    }, 20000);
    
    it('should load a different user when button is clicked', async () => {
      const { act } = await import('react');
      
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      await act(async () => {
        render(<UserProfile />);
      });
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-details')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('load-user-2'));
      });
      
      expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-details')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      expect(screen.getByTestId('user-id')).toHaveTextContent('ID: 2');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Name: User 2');
      expect(api.fetchUser).toHaveBeenCalledWith(2);
      
      console.error = originalConsoleError;
    }, 30000);
    
    it('should show error boundary when loading invalid user', async () => {
      const { act } = await import('react');
      
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      await act(async () => {
        render(<UserProfile />);
      });
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-details')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('load-invalid-user'));
      });
      
      expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      expect(screen.getByTestId('error-message')).toHaveTextContent('User not found');
      expect(api.fetchUser).toHaveBeenCalledWith(0);
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('retry-button'));
      });
      
      expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
      
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-details')).toBeInTheDocument();
      }, { timeout: 15000 });
      
      expect(screen.getByTestId('user-id')).toHaveTextContent('ID: 1');
      
      console.error = originalConsoleError;
    }, 40000);
  });
  
  describe('Testing createResource Function', () => {
    it('should return a resource with read method', () => {
      const resource = createResource(Promise.resolve('test'));
      
      expect(resource).toHaveProperty('read');
      expect(typeof resource.read).toBe('function');
    });
    
    it('should throw the promise when read before resolution', () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('test'), 100));
      const resource = createResource(promise);
      
      expect(() => resource.read()).toThrow();
    });
    
    it('should return the resolved value after resolution', async () => {
      const promise = Promise.resolve('test value');
      const resource = createResource(promise);
      
      await promise;
      
      expect(resource.read()).toBe('test value');
    });
    
    it('should throw the error when promise rejects', async () => {
      const error = new Error('test error');
      const promise = Promise.reject(error);
      const resource = createResource(promise);
      
      await promise.catch(() => {});
      
      expect(() => resource.read()).toThrow('test error');
    });
  });
});
