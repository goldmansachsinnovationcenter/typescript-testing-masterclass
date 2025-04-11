/**
 * This test file demonstrates how to test components with useEffect in Vitest
 * with TypeScript, focusing on mocking dependencies and testing side effects.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProfile, api } from './useEffectComponent';

describe('UserProfile Component with useEffect', () => {
  const originalTitle = document.title;
  
  vi.spyOn(api, 'fetchUser');
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    document.title = originalTitle;
    
    (api.fetchUser as any).mockResolvedValue({ id: 1, name: 'Test User' });
  });
  
  afterEach(() => {
    vi.clearAllTimers();
  });
  
  it('should show loading state initially', () => {
    render(<UserProfile userId={1} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  
  it('should fetch and display user data', async () => {
    render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });
    
    expect(api.fetchUser).toHaveBeenCalledWith(1);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
  
  it('should call onDataLoad callback when data is loaded', async () => {
    const onDataLoad = vi.fn();
    
    render(<UserProfile userId={1} onDataLoad={onDataLoad} />);
    
    await waitFor(() => {
      expect(onDataLoad).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
    });
  });
  
  it('should handle API errors', async () => {
    const error = new Error('Failed to fetch');
    (api.fetchUser as any).mockRejectedValue(error);
    
    const onError = vi.fn();
    
    render(<UserProfile userId={1} onError={onError} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    
    expect(onError).toHaveBeenCalledWith(error);
  });
  
  it('should update document title when user changes', async () => {
    render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(document.title).toBe('Profile: Test User');
    });
    
    (api.fetchUser as any).mockResolvedValue({ id: 2, name: 'Another User' });
    
    render(<UserProfile userId={2} />);
    
    await waitFor(() => {
      expect(document.title).toBe('Profile: Another User');
    });
  });
  
  it('should increment counter with interval', async () => {
    vi.useFakeTimers();
    
    render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('counter')).toHaveTextContent('Counter: 0');
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('counter')).toHaveTextContent('Counter: 1');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('counter')).toHaveTextContent('Counter: 3');
    
    vi.useRealTimers();
  });
  
  it('should handle manual counter increment', async () => {
    render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('counter')).toHaveTextContent('Counter: 0');
    
    act(() => {
      fireEvent.click(screen.getByText('Increment'));
    });
    
    expect(screen.getByTestId('counter')).toHaveTextContent('Counter: 1');
  });
  
  it('should clean up effects when unmounted', async () => {
    vi.useFakeTimers();
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<UserProfile userId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });
    
    act(() => {
      unmount();
    });
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
  
  it('should not update state after unmount', async () => {
    vi.useFakeTimers();
    
    const consoleErrorMock = vi.spyOn(console, 'error');
    consoleErrorMock.mockImplementation(() => {});
    
    (api.fetchUser as any).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ id: 1, name: 'Test User' }), 100);
      });
    });
    
    const { unmount } = render(<UserProfile userId={1} />);
    
    unmount();
    
    vi.advanceTimersByTime(200);
    
    expect(consoleErrorMock).not.toHaveBeenCalledWith(
      expect.stringMatching(/Can't perform a React state update on an unmounted component/)
    );
    
    consoleErrorMock.mockRestore();
    vi.useRealTimers();
  });
});
