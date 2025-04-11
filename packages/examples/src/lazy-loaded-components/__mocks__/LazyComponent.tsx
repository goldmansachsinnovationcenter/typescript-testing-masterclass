/**
 * Mock implementation of the LazyComponent
 */
import React from 'react';
import { vi } from 'vitest';

const MockLazyComponent = vi.fn().mockImplementation(({ title, onAction }) => (
  <div data-testid="mock-lazy-component">
    <h2>{title}</h2>
    <button onClick={onAction}>Mocked Button</button>
  </div>
));

export default MockLazyComponent;
