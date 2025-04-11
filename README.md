# Vitest Mocking Guide with TypeScript

This repository contains a comprehensive guide for mocking and spying on functions in Vitest with TypeScript, focusing on avoiding hoisting-related errors. All examples demonstrate best practices for TypeScript type safety and proper handling of Vitest's mocking system.

## Table of Contents

- [Introduction](#introduction)
- [Project Setup](#project-setup)
- [Mocking Techniques](#mocking-techniques)
  - [Direct Module Imports](#direct-module-imports)
  - [Indirect Module Dependencies](#indirect-module-dependencies)
  - [Lazy-loaded React Components](#lazy-loaded-react-components)
  - [Dynamic Imports](#dynamic-imports)
  - [Same Package Mocking](#same-package-mocking)
- [React-Specific Testing](#react-specific-testing)
  - [Testing Custom Hooks](#testing-custom-hooks)
  - [Testing useEffect](#testing-useeffect)
  - [Testing Context API](#testing-context-api)
  - [Testing React Router](#testing-react-router)
  - [Testing Suspense and Error Boundaries](#testing-suspense-and-error-boundaries)
- [Advanced Testing Techniques](#advanced-testing-techniques)
  - [Testing Asynchronous Code](#testing-asynchronous-code)
  - [Test Doubles: Stubs vs Mocks vs Spies](#test-doubles-stubs-vs-mocks-vs-spies)
  - [Accessibility Testing](#accessibility-testing)
  - [Testing Node.js Scripts](#testing-nodejs-scripts)
- [Common Patterns](#common-patterns)
  - [Handling Hoisting](#handling-hoisting)
  - [Type Safety with MockedFunction](#type-safety-with-mockedfunction)
  - [Spy Assertions](#spy-assertions)
  - [Mock Implementation](#mock-implementation)
  - [Cross-test Spying](#cross-test-spying)
- [Running the Examples](#running-the-examples)

## Introduction

When testing with Vitest and TypeScript, proper mocking is essential for creating isolated, reliable tests. This guide addresses common challenges:

- **Hoisting Issues**: Vitest hoists `vi.mock()` calls to the top of the file, which can cause reference errors
- **Type Safety**: Ensuring mock functions maintain proper TypeScript types
- **Cross-test Spying**: Defining spy variables that can be accessed across multiple test cases

Each example in this repository demonstrates solutions to these challenges using Vitest best practices.

## Project Setup

This project uses:

- Vitest for testing
- TypeScript for type safety
- React Testing Library for component testing
- JSDOM for browser environment simulation

The configuration files are:
- [package.json](./package.json) - Project dependencies and scripts
- [tsconfig.json](./tsconfig.json) - TypeScript configuration
- [vitest.config.ts](./vitest.config.ts) - Vitest configuration

## Mocking Techniques

### Direct Module Imports

**Problem**: Mocking functions that are directly imported into the module under test.

**Solution**: Use `vi.mock()` to mock the entire module and properly type the mock functions.

**Example Files**:
- Implementation: [api.ts](./src/examples/direct-imports/api.ts) and [user-service.ts](./src/examples/direct-imports/user-service.ts)
- Mock Implementation: [__mocks__/api.ts](./src/examples/direct-imports/__mocks__/api.ts)
- Test: [direct-imports.test.ts](./src/examples/direct-imports/direct-imports.test.ts)

**Key Techniques**:

```typescript
// Import vi and MockedFunction
import { vi, MockedFunction } from 'vitest';

// Mock the module before importing anything else
vi.mock('./api');

// Import and type the mocked functions
import { fetchData, postData } from './api';
const mockFetchData = fetchData as MockedFunction<typeof fetchData>;
const mockPostData = postData as MockedFunction<typeof postData>;

// Now you can use mock methods
mockFetchData.mockResolvedValue(mockUser);
```

This approach ensures:
1. The mock is hoisted correctly
2. The mock functions have proper TypeScript types
3. You can make assertions on the mock calls

### Indirect Module Dependencies

**Problem**: Mocking modules that are used by other modules (indirect dependencies).

**Solution**: Mock the dependency module and verify it's used correctly by the module under test.

**Example Files**:
- Implementation: [database.ts](./src/examples/indirect-dependencies/database.ts), [db-client.ts](./src/examples/indirect-dependencies/db-client.ts), and [user-repository.ts](./src/examples/indirect-dependencies/user-repository.ts)
- Test: [indirect-dependencies.test.ts](./src/examples/indirect-dependencies/indirect-dependencies.test.ts)

**Key Techniques**:

```typescript
// Mock the Database module
vi.mock('./database', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      connect: mockConnect,
      query: mockQuery,
      disconnect: mockDisconnect
    }))
  };
});

// Test that the client uses the database correctly
it('should query the database with the correct parameters', async () => {
  const client = new DbClient(dbConfig);
  await client.initialize();
  await client.findUsers('test');
  
  expect(mockQuery).toHaveBeenCalledWith(
    'SELECT * FROM users WHERE name LIKE ?',
    ['%test%']
  );
});
```

This approach allows you to:
1. Verify that modules correctly use their dependencies
2. Test error handling and edge cases
3. Avoid complex setup of real database connections

### Lazy-loaded React Components

**Problem**: Mocking React components that are loaded using `React.lazy()`.

**Solution**: Mock both the component and React's lazy function.

**Example Files**:
- Implementation: [AppWithLazyLoading.tsx](./src/examples/lazy-loaded-components/AppWithLazyLoading.tsx) and [LazyComponent.tsx](./src/examples/lazy-loaded-components/LazyComponent.tsx)
- Mock Implementation: [__mocks__/LazyComponent.tsx](./src/examples/lazy-loaded-components/__mocks__/LazyComponent.tsx)
- Test: [lazy-loaded-components.test.tsx](./src/examples/lazy-loaded-components/lazy-loaded-components.test.tsx)

**Key Techniques**:

```typescript
// Create a mock function for our component
const mockLazyComponentFn = vi.fn();

// Mock the LazyComponent module
vi.mock('./LazyComponent', () => {
  return {
    default: function MockLazyComponent(props) {
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
```

This approach allows you to:
1. Test components that use lazy loading without the complexity of Suspense
2. Make assertions on props passed to lazy-loaded components
3. Test interactions with lazy-loaded components

### Dynamic Imports

**Problem**: Mocking modules that are dynamically imported using `import()`.

**Solution**: Mock the dynamically imported module and ensure it's properly loaded.

**Example Files**:
- Implementation: [calculator.ts](./src/examples/dynamic-imports/calculator.ts) and [math-utils.ts](./src/examples/dynamic-imports/math-utils.ts)
- Test: [dynamic-imports.test.ts](./src/examples/dynamic-imports/dynamic-imports.test.ts)

**Key Techniques**:

```typescript
// Define mock functions
const mockAdd = vi.fn();
const mockSubtract = vi.fn();
const mockMultiply = vi.fn();
const mockDivide = vi.fn();

// Mock the dynamically imported module
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

// Test that dynamic imports work correctly
it('should mock dynamically imported add function', async () => {
  const result = await calculator.performOperation('add', 5, 3);
  
  expect(mockAdd).toHaveBeenCalledWith(5, 3);
  expect(result).toBe(8);
});
```

This approach allows you to:
1. Test code that uses dynamic imports
2. Verify that the correct functions are called with the right arguments
3. Control the behavior of dynamically imported functions

### Same Package Mocking

**Problem**: Mocking modules that are in the same package as the module under test.

**Solution**: Use the `__mocks__` directory to provide mock implementations.

**Example Files**:
- Implementation: [utils.ts](./src/examples/same-package/utils.ts) and [user.ts](./src/examples/same-package/user.ts)
- Mock Implementation: [__mocks__/utils.ts](./src/examples/same-package/__mocks__/utils.ts)
- Test: [same-package.test.ts](./src/examples/same-package/same-package.test.ts)

**Key Techniques**:

```typescript
// Import vi and MockedFunction
import { vi, MockedFunction } from 'vitest';

// Mock the utils module
vi.mock('./utils');

// Import and type the mocked functions
import { generateId, validateEmail, formatDate } from './utils';
const mockGenerateId = generateId as MockedFunction<typeof generateId>;
const mockValidateEmail = validateEmail as MockedFunction<typeof validateEmail>;
const mockFormatDate = formatDate as MockedFunction<typeof formatDate>;

// Now you can use mock methods
mockGenerateId.mockReturnValue('mocked-id-123');
mockValidateEmail.mockReturnValue(true);
```

This approach allows you to:
1. Mock internal dependencies within the same package
2. Control the behavior of utility functions
3. Test error handling and edge cases

## React-Specific Testing

This section covers advanced testing techniques for React components and hooks, focusing on scenarios that are typically challenging to test.

### Testing Custom Hooks

**Problem**: Testing React hooks outside of components.

**Solution**: Use `renderHook` from `@testing-library/react` to test hooks in isolation.

**Example Files**:
- Implementation: [useCounter.ts](./src/examples/react-specific/hooks/useCounter.ts)
- Test: [useCounter.test.ts](./src/examples/react-specific/hooks/useCounter.test.ts)

**Key Techniques**:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

it('should increment the counter', () => {
  // Arrange - render the hook
  const { result } = renderHook(() => useCounter({ initialValue: 5 }));
  
  // Act - call the hook function inside act()
  act(() => {
    result.current.increment();
  });
  
  // Assert - check the updated state
  expect(result.current.count).toBe(6);
});

it('should respect min and max values', () => {
  // Arrange - render with custom options
  const { result } = renderHook(() => 
    useCounter({ initialValue: 5, min: 0, max: 10 })
  );
  
  // Act - try to exceed max
  act(() => {
    result.current.increment();
    result.current.increment();
    result.current.increment();
    result.current.increment();
    result.current.increment();
    result.current.increment();
  });
  
  // Assert - value should be capped at max
  expect(result.current.count).toBe(10);
});
```

This approach allows you to:
1. Test hooks in isolation without rendering components
2. Test all hook functions and state updates
3. Test hook behavior with different initialization options

### Testing useEffect

**Problem**: Testing components with `useEffect` hooks that have side effects.

**Solution**: Use mocks for side effects and `waitFor` to handle asynchronous updates.

**Example Files**:
- Implementation: [useEffectComponent.tsx](./src/examples/react-specific/hooks/useEffectComponent.tsx)
- Test: [useEffect.test.tsx](./src/examples/react-specific/hooks/useEffect.test.tsx)

**Key Techniques**:

```typescript
// Mock API calls
const mockFetchUser = vi.fn();
vi.mock('./api', () => ({
  fetchUser: (id) => mockFetchUser(id)
}));

it('should fetch user data on mount', async () => {
  // Arrange
  mockFetchUser.mockResolvedValue({ id: 1, name: 'John Doe' });
  
  // Act
  render(<UserProfile />);
  
  // Assert - initially shows loading
  expect(screen.getByTestId('loading')).toBeInTheDocument();
  
  // Assert - shows user data after loading
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  expect(mockFetchUser).toHaveBeenCalledWith(1);
});

it('should clean up effects when unmounted', () => {
  // Arrange
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
  
  // Act
  const { unmount } = render(<ComponentWithInterval />);
  unmount();
  
  // Assert
  expect(clearIntervalSpy).toHaveBeenCalled();
});
```

This approach allows you to:
1. Test initial render, loading states, and final states
2. Verify that side effects like API calls are triggered correctly
3. Test cleanup functions to prevent memory leaks

### Testing Context API

**Problem**: Testing components that consume React Context.

**Solution**: Provide mock context values or use the actual provider in tests.

**Example Files**:
- Implementation: [ThemeContext.tsx](./src/examples/react-specific/context/ThemeContext.tsx) and [ThemedComponent.tsx](./src/examples/react-specific/context/ThemedComponent.tsx)
- Test: [context.test.tsx](./src/examples/react-specific/context/context.test.tsx)

**Key Techniques**:

```typescript
// Testing with the actual provider
it('should render with default theme', () => {
  // Act
  render(
    <ThemeProvider initialMode="light">
      <ThemedButton>Test Button</ThemedButton>
    </ThemeProvider>
  );
  
  // Assert
  const button = screen.getByTestId('themed-button');
  expect(button).toHaveStyle('background-color: #f0f0f0');
  expect(button).toHaveStyle('color: #000');
});

// Testing with a mocked context value
it('should call toggleTheme when clicked', () => {
  // Arrange
  const mockToggleTheme = vi.fn();
  
  // Act
  render(
    <ThemeContext.Provider value={{
      mode: 'light',
      isDark: false,
      setMode: vi.fn(),
      toggleTheme: mockToggleTheme
    }}>
      <ThemedButton>Toggle Theme</ThemedButton>
    </ThemeContext.Provider>
  );
  
  // Act
  fireEvent.click(screen.getByTestId('themed-button'));
  
  // Assert
  expect(mockToggleTheme).toHaveBeenCalledTimes(1);
});
```

This approach allows you to:
1. Test components with their actual context providers
2. Test components with mocked context values
3. Verify that context updates correctly affect components

### Testing React Router

**Problem**: Testing components that use React Router hooks and components.

**Solution**: Use `MemoryRouter` for integration tests and mock router hooks for unit tests.

**Example Files**:
- Implementation: [Router.tsx](./src/examples/react-specific/router/Router.tsx)
- Test: [router.test.tsx](./src/examples/react-specific/router/router.test.tsx)

**Key Techniques**:

```typescript
// Mock router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ userId: '42' })
  };
});

// Integration tests with MemoryRouter
it('should render the correct route', () => {
  // Act
  render(
    <MemoryRouter initialEntries={['/users']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserDetail />} />
      </Routes>
    </MemoryRouter>
  );
  
  // Assert
  expect(screen.getByTestId('users-page')).toBeInTheDocument();
  expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
});

it('should navigate between routes', () => {
  // Act
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </MemoryRouter>
  );
  
  // Act - click on a link
  fireEvent.click(screen.getByTestId('users-link'));
  
  // Assert
  expect(screen.getByTestId('users-page')).toBeInTheDocument();
});
```

This approach allows you to:
1. Test routing logic without a browser
2. Test navigation between routes
3. Test components that use router hooks like `useParams` and `useNavigate`

### Testing Suspense and Error Boundaries

**Problem**: Testing components that use React Suspense and Error Boundaries.

**Solution**: Create mock resources that can be controlled in tests and test error handling.

**Example Files**:
- Implementation: [DataFetcher.tsx](./src/examples/react-specific/suspense/DataFetcher.tsx)
- Test: [suspense.test.tsx](./src/examples/react-specific/suspense/suspense.test.tsx)

**Key Techniques**:

```typescript
// Testing loading states
it('should render loading fallback initially', () => {
  // Arrange
  const neverResolve = new Promise(() => {});
  const resource = createResource(neverResolve);
  
  // Act
  render(
    <Suspense fallback={<LoadingFallback />}>
      <UserDetails resource={resource} />
    </Suspense>
  );
  
  // Assert
  expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
});

// Testing resolved data
it('should render data after loading', async () => {
  // Arrange
  const mockUser = { id: 1, name: 'Test User' };
  const promise = Promise.resolve(mockUser);
  const resource = createResource(promise);
  
  // Act
  render(
    <Suspense fallback={<LoadingFallback />}>
      <UserDetails resource={resource} />
    </Suspense>
  );
  
  // Wait for promise to resolve
  await promise;
  
  // Assert
  await waitFor(() => {
    expect(screen.getByTestId('user-details')).toBeInTheDocument();
  });
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

// Testing error boundaries
it('should render error fallback when error occurs', () => {
  // Arrange
  const TestComponent = () => {
    throw new Error('Test error');
  };
  
  // Act
  render(
    <ErrorBoundary fallback={<div data-testid="error-fallback">Error</div>}>
      <TestComponent />
    </ErrorBoundary>
  );
  
  // Assert
  expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
});
```

This approach allows you to:
1. Test loading states with Suspense
2. Test successful data loading and rendering
3. Test error handling with Error Boundaries

## Advanced Testing Techniques

### Testing Asynchronous Code

**Problem**: Testing asynchronous code with promises, async/await, and handling race conditions.

**Solution**: Use Vitest's timer mocks and async utilities to control and test asynchronous behavior.

**Example Files**:
- Implementation: [api-client.ts](./src/examples/async-testing/api-client.ts)
- Test: [async-testing.test.ts](./src/examples/async-testing/async-testing.test.ts)

**Key Techniques**:

```typescript
// Testing promise resolution
it('should resolve with user data for valid ID', async () => {
  // Arrange
  const userId = 1;
  
  // Act
  const promise = apiClient.getUser(userId);
  
  // Fast-forward timers to resolve promises immediately
  vi.runAllTimers();
  
  // Assert
  await expect(promise).resolves.toEqual(expect.objectContaining({
    data: expect.objectContaining({
      id: userId,
      name: `User ${userId}`
    })
  }));
});

// Testing promise rejection
it('should reject for invalid user ID', async () => {
  // Arrange
  const userId = -1;
  
  // Act
  const promise = apiClient.getUser(userId);
  
  // Fast-forward timers
  vi.runAllTimers();
  
  // Assert - test promise rejection
  await expect(promise).rejects.toThrow('User not found');
});

// Testing race conditions
it('should handle timeout race conditions', async () => {
  // Arrange
  const userId = 1;
  
  // Mock implementation to simulate a slow request
  const getUserSpy = vi.spyOn(apiClient as any, 'getUser');
  getUserSpy.mockImplementationOnce(async () => {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Very long delay
    return { data: { id: userId, name: 'User 1' } };
  });
  
  // Act
  const promise = apiClient.getUserWithTimeout(userId);
  
  // Fast-forward past the timeout
  vi.advanceTimersByTime(6000);
  
  // Assert
  const result = await promise;
  expect(result).toBeNull();
});
```

This approach allows you to:
1. Test promise resolution and rejection
2. Control the timing of asynchronous operations
3. Test race conditions and timeouts
4. Test error handling in asynchronous code

### Test Doubles: Stubs vs Mocks vs Spies

**Problem**: Understanding when to use different types of test doubles (stubs, mocks, and spies).

**Solution**: Learn the differences between test doubles and when to use each type.

**Example Files**:
- Implementation: [payment-service.ts](./src/examples/test-doubles/payment-service.ts)
- Test: [test-doubles.test.ts](./src/examples/test-doubles/test-doubles.test.ts)

**Key Techniques**:

```typescript
// Using stubs - simple replacements with predefined responses
const stubGateway: PaymentGateway = {
  processPayment: async () => ({ 
    success: true, 
    transactionId: 'stub-transaction-123' 
  }),
  refundPayment: async () => ({ success: true })
};

// Using spies - track calls to real implementations
const gateway: PaymentGateway = {
  processPayment: async () => ({ success: true, transactionId: 'tx-123' })
};
const processPaymentSpy = vi.spyOn(gateway, 'processPayment');

// Using mocks - programmed with expectations
const mockGateway = {
  processPayment: vi.fn().mockResolvedValue({
    success: true,
    transactionId: 'mock-transaction-123'
  })
};

// Verifying interactions with mocks
expect(mockGateway.processPayment).toHaveBeenCalledWith(paymentDetails);
expect(mockGateway.processPayment).toHaveBeenCalledTimes(1);
```

This approach helps you understand:
1. When to use stubs (for simple replacements)
2. When to use spies (for tracking calls to real implementations)
3. When to use mocks (for complex verification of interactions)
4. How to make assertions on different types of test doubles

### Accessibility Testing

**Problem**: Ensuring that React components are accessible to all users.

**Solution**: Use jest-axe and Testing Library to test accessibility features.

**Example Files**:
- Implementation: [accessible-form.tsx](./src/examples/accessibility-testing/accessible-form.tsx)
- Test: [accessibility-testing.test.tsx](./src/examples/accessibility-testing/accessibility-testing.test.tsx)

**Key Techniques**:

```typescript
// Add custom matcher for axe
expect.extend(toHaveNoViolations);

// Testing for accessibility violations
it('should have no accessibility violations', async () => {
  // Arrange
  const { container } = render(<AccessibleForm onSubmit={mockSubmit} />);
  
  // Act - Run axe on the rendered component
  const results = await axe(container);
  
  // Assert - Check for accessibility violations
  expect(results).toHaveNoViolations();
});

// Testing ARIA attributes
it('should have proper aria-required attributes', () => {
  // Arrange & Act
  render(<AccessibleForm onSubmit={mockSubmit} />);
  
  // Assert
  expect(screen.getByTestId('name-input')).toHaveAttribute('aria-required', 'true');
  expect(screen.getByTestId('email-input')).toHaveAttribute('aria-required', 'true');
});

// Testing focus management
it('should focus the first field with an error after failed submission', async () => {
  // Arrange
  render(<AccessibleForm onSubmit={mockSubmit} />);
  
  // Act - Submit the form without filling it out
  const submitButton = screen.getByTestId('submit-button');
  fireEvent.click(submitButton);
  
  // Assert - Check that the name input is focused
  await waitFor(() => {
    expect(screen.getByTestId('name-input')).toHaveFocus();
  });
});
```

This approach allows you to:
1. Test for accessibility violations using automated tools
2. Verify proper ARIA attributes
3. Test keyboard navigation and focus management
4. Ensure screen reader announcements work correctly

### Testing Node.js Scripts

**Problem**: Testing Node.js scripts that use native modules like fs and user prompts.

**Solution**: Mock native modules and user interactions to test CLI scripts.

**Example Files**:
- Implementation: [cli-script.ts](./src/examples/nodejs-testing/cli-script.ts)
- Test: [nodejs-testing.test.ts](./src/examples/nodejs-testing/nodejs-testing.test.ts)

**Key Techniques**:

```typescript
// Mock the fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn()
}));

// Mock the inquirer module
vi.mock('inquirer', () => ({
  prompt: vi.fn()
}));

// Mock console.log and console.error
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();
console.log = mockConsoleLog;
console.error = mockConsoleError;

// Testing file system operations
it('should read configuration file correctly', () => {
  // Arrange
  (fs.readFileSync as any).mockReturnValue(JSON.stringify(sampleConfig));
  
  // Act
  const result = readConfig('./config.json');
  
  // Assert
  expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
  expect(result).toEqual(sampleConfig);
});

// Testing user interaction
it('should prompt for configuration', async () => {
  // Arrange
  (inquirer.prompt as any).mockResolvedValue(sampleConfig);
  
  // Act
  const result = await promptForConfig();
  
  // Assert
  expect(inquirer.prompt).toHaveBeenCalled();
  expect(result).toEqual(sampleConfig);
});
```

This approach allows you to:
1. Test file system operations without touching the real file system
2. Test user interactions with CLI prompts
3. Verify console output and error handling
4. Test the entire CLI workflow

## Common Patterns

### Handling Hoisting

Vitest hoists `vi.mock()` calls to the top of the file, which can cause reference errors if you try to use variables defined before the import statements. To avoid this:

1. Always place `vi.mock()` calls before any imports
2. Define mock functions after the imports
3. Use `vi.importActual()` if you need to access the original module

```typescript
import { vi } from 'vitest';

// Place vi.mock() calls before other imports
vi.mock('./module-to-mock');

// Then import everything else
import { describe, it, expect } from 'vitest';
import { functionToTest } from './module-under-test';
import { mockedFunction } from './module-to-mock';

// Now define your test cases
describe('Module under test', () => {
  // ...
});
```

### Type Safety with MockedFunction

To ensure type safety with mock functions, use Vitest's `MockedFunction` type:

```typescript
import { vi, MockedFunction } from 'vitest';

vi.mock('./api');

import { fetchData } from './api';
const mockFetchData = fetchData as MockedFunction<typeof fetchData>;
```

This ensures that:
1. The mock function has the same type signature as the original
2. TypeScript recognizes the mock methods like `mockReturnValue`
3. You get proper type checking for arguments and return values

### Spy Assertions

Vitest provides several methods for making assertions on spy calls:

```typescript
// Assert that a function was called
expect(mockFunction).toHaveBeenCalled();

// Assert that a function was called a specific number of times
expect(mockFunction).toHaveBeenCalledTimes(2);

// Assert that a function was called with specific arguments
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');

// Assert on the call history
expect(mockFunction.mock.calls).toEqual([
  ['first call args'],
  ['second call args']
]);
```

### Mock Implementation

You can control the behavior of mock functions in several ways:

```typescript
// Return a fixed value
mockFunction.mockReturnValue('fixed value');

// Return different values on successive calls
mockFunction.mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call');

// Resolve with a value (for async functions)
mockFunction.mockResolvedValue({ data: 'value' });

// Implement custom logic
mockFunction.mockImplementation((arg1, arg2) => {
  return arg1 + arg2;
});
```

### Cross-test Spying

To define spy variables that can be accessed across multiple test cases:

1. Define the mock functions at the top level of the test file
2. Reset the mocks in `beforeEach` or `afterEach` hooks
3. Make assertions in individual test cases

```typescript
// Define at the top level
const mockFunction = vi.fn();

describe('Test suite', () => {
  beforeEach(() => {
    // Reset before each test
    mockFunction.mockReset();
  });

  it('test case 1', () => {
    // Use in test case 1
    mockFunction('arg1');
    expect(mockFunction).toHaveBeenCalledWith('arg1');
  });

  it('test case 2', () => {
    // Use in test case 2
    mockFunction('arg2');
    expect(mockFunction).toHaveBeenCalledWith('arg2');
  });
});
```

## Running the Examples

To run all the examples:

```bash
npm test
```

To run a specific example:

```bash
npm test -- src/examples/direct-imports/direct-imports.test.ts
```

All examples are fully typed with TypeScript and pass all tests without warnings.
