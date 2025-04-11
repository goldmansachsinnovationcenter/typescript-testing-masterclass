/**
 * This test file demonstrates how to mock lazy-loaded React components in Vitest
 * with TypeScript, focusing on avoiding hoisting-related errors.
 */

// Import vi first
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Create a mock function for our component
const mockLazyComponentFn = vi.fn();

// Mock the LazyComponent module before importing anything else
vi.mock('./LazyComponent', () => {
  // Return a mock implementation that uses our spy function
  return {
    default: function MockLazyComponent(props: { title: string; onAction: () => void }) {
      mockLazyComponentFn(props);
      return (
        <div data-testid="mock-lazy-component">
          <h2>{props.title}</h2>
          <button onClick={props.onAction}>Mocked Button</button>
        </div>
      );
    }
  };
});

// Mock React's lazy function to return the imported component directly
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  const lazyComponent = (await import('./LazyComponent')).default;
  
  return {
    ...actual,
    lazy: () => lazyComponent
  };
});

// Now import everything else
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppWithLazyLoading from './AppWithLazyLoading';

describe('Lazy Loaded React Components Mocking', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should render the app with the mocked lazy component', () => {
    render(<AppWithLazyLoading />);
    
    // Click to show the lazy component
    fireEvent.click(screen.getByText('Show Lazy Component'));
    
    // Verify the component is rendered
    expect(screen.getByTestId('mock-lazy-component')).toBeInTheDocument();
    
    // Verify our spy function was called with the correct props
    expect(mockLazyComponentFn).toHaveBeenCalledTimes(1);
    expect(mockLazyComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Lazy Loaded Component (0)',
        onAction: expect.any(Function)
      })
    );
  });

  it('should pass the correct props to the lazy component', () => {
    render(<AppWithLazyLoading initialTitle="Custom Title" />);
    
    // Click to show the lazy component
    fireEvent.click(screen.getByText('Show Lazy Component'));
    
    // Verify our spy function was called with the correct props
    expect(mockLazyComponentFn).toHaveBeenCalledTimes(1);
    expect(mockLazyComponentFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Custom Title (0)'
      })
    );
  });

  it('should handle interactions with the mocked component', () => {
    render(<AppWithLazyLoading />);
    
    // Click to show the lazy component
    fireEvent.click(screen.getByText('Show Lazy Component'));
    
    // Click the button in the lazy component
    fireEvent.click(screen.getByText('Mocked Button'));
    
    // Verify the count was incremented
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    
    // Verify our spy function was called again with the updated props
    expect(mockLazyComponentFn).toHaveBeenCalledTimes(2);
    
    // Get the last call arguments
    const lastCallArgs = mockLazyComponentFn.mock.calls[1][0];
    
    // Verify the title was updated
    expect(lastCallArgs.title).toBe('Lazy Loaded Component (1)');
  });

  it('should toggle the lazy component visibility', () => {
    render(<AppWithLazyLoading />);
    
    // Click to show the lazy component
    fireEvent.click(screen.getByText('Show Lazy Component'));
    
    // Verify the component is visible
    expect(screen.getByTestId('mock-lazy-component')).toBeInTheDocument();
    expect(screen.getByText('Hide Lazy Component')).toBeInTheDocument();
    
    // Click to hide the lazy component
    fireEvent.click(screen.getByText('Hide Lazy Component'));
    
    // Verify the component is hidden
    expect(screen.queryByTestId('mock-lazy-component')).not.toBeInTheDocument();
    expect(screen.getByText('Show Lazy Component')).toBeInTheDocument();
  });
});
