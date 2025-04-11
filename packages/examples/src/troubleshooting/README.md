# Troubleshooting Vitest Tests

This guide provides solutions for common issues encountered when writing and running tests with Vitest in TypeScript projects.

## Table of Contents

- [Common Test Failures](#common-test-failures)
  - [Hoisting Issues](#hoisting-issues)
  - [Type Errors](#type-errors)
  - [Async Test Failures](#async-test-failures)
  - [Mock Implementation Errors](#mock-implementation-errors)
- [Debugging Techniques](#debugging-techniques)
  - [Using Debug Mode](#using-debug-mode)
  - [Inspecting Test State](#inspecting-test-state)
  - [Debugging with Breakpoints](#debugging-with-breakpoints)
- [Performance Optimization](#performance-optimization)
  - [Reducing Test Execution Time](#reducing-test-execution-time)
  - [Optimizing Mock Performance](#optimizing-mock-performance)
  - [Efficient Test Setup](#efficient-test-setup)
- [Environment Issues](#environment-issues)
  - [DOM Testing Problems](#dom-testing-problems)
  - [Timer Mocking Issues](#timer-mocking-issues)
  - [Module Resolution Problems](#module-resolution-problems)

## Common Test Failures

### Hoisting Issues

One of the most common issues with Vitest (and Jest) is related to the hoisting of `vi.mock()` calls.

#### Problem:

```typescript
import { someFunction } from './module';
vi.mock('./module'); // Error: vi.mock() must be called before any imports

describe('Test Suite', () => {
  it('should mock the function', () => {
    // Test code
  });
});
```

#### Solution:

Always place `vi.mock()` calls before imports:

```typescript
// Correct placement
vi.mock('./module');
import { someFunction } from './module';

describe('Test Suite', () => {
  it('should mock the function', () => {
    // Test code
  });
});
```

### Type Errors

TypeScript type errors in tests often occur when mocking functions or modules.

#### Problem:

```typescript
// Error: Type 'Mock<any, any>' is not assignable to type 'Function'
const mockFunction = vi.fn();
someObject.method = mockFunction;
```

#### Solution:

Use proper typing for mocked functions:

```typescript
// Using MockedFunction
import { vi, MockedFunction } from 'vitest';

// Option 1: Type assertion
const mockFunction = vi.fn() as MockedFunction<typeof originalFunction>;

// Option 2: Generic parameter
const mockFunction: MockedFunction<typeof originalFunction> = vi.fn();
```

### Async Test Failures

Async tests can fail in subtle ways if not properly structured.

#### Problem:

```typescript
// This test might pass even if it shouldn't
it('should handle async operation', () => {
  const promise = asyncFunction();
  expect(promise).resolves.toBe(true);
});
```

#### Solution:

Always use `async/await` or return the promise:

```typescript
// Option 1: Using async/await
it('should handle async operation', async () => {
  await expect(asyncFunction()).resolves.toBe(true);
});

// Option 2: Returning the promise
it('should handle async operation', () => {
  return expect(asyncFunction()).resolves.toBe(true);
});
```

### Mock Implementation Errors

Incorrect mock implementations can lead to subtle test failures.

#### Problem:

```typescript
// Mock doesn't match the original function signature
vi.mock('./api', () => ({
  fetchData: () => 'mocked data' // Original returns a Promise
}));
```

#### Solution:

Ensure mock implementations match the original function signatures:

```typescript
vi.mock('./api', () => ({
  fetchData: vi.fn().mockResolvedValue('mocked data')
}));
```

## Debugging Techniques

### Using Debug Mode

Vitest provides a debug mode that can help identify issues in failing tests.

```bash
# Run tests in debug mode
npx vitest --debug

# Run a specific test file in debug mode
npx vitest --debug path/to/test.ts
```

### Inspecting Test State

Add debug logs to inspect the state during test execution:

```typescript
it('should process data correctly', () => {
  const result = processData(input);
  console.log('Input:', input);
  console.log('Result:', result);
  expect(result).toEqual(expected);
});
```

For more structured debugging, use the `debug` utility:

```typescript
import debug from 'debug';
const log = debug('test:component');

it('should render correctly', () => {
  log('Starting test');
  const { result } = renderHook(() => useMyHook());
  log('Hook result:', result.current);
  expect(result.current).toBeDefined();
});
```

### Debugging with Breakpoints

Use the Node.js debugger to set breakpoints in your tests:

1. Add the `debugger` statement where you want to pause execution:

```typescript
it('should calculate correctly', () => {
  const input = { value: 5 };
  debugger; // Execution will pause here when running with --inspect
  const result = calculate(input);
  expect(result).toBe(10);
});
```

2. Run Vitest with the Node.js inspector:

```bash
node --inspect-brk node_modules/.bin/vitest run path/to/test.ts
```

3. Open Chrome and navigate to `chrome://inspect` to connect to the debugger.

## Performance Optimization

### Reducing Test Execution Time

Slow tests can significantly impact development productivity. Here are some strategies to speed up your tests:

1. **Run tests in parallel**:

```bash
npx vitest --threads=true
```

2. **Filter tests to run only what's needed**:

```bash
# Run only tests matching a pattern
npx vitest --testNamePattern="should handle errors"

# Run only specific test files
npx vitest path/to/specific/test.ts
```

3. **Use `.skip` and `.only` strategically**:

```typescript
// Skip slow tests during development
it.skip('should process large dataset', () => {
  // Slow test
});

// Focus on specific tests
it.only('should handle the case I'm working on', () => {
  // Only this test will run
});
```

### Optimizing Mock Performance

Inefficient mocks can slow down tests:

1. **Mock at the right level**:

```typescript
// Instead of mocking the entire module
vi.mock('./database');

// Mock only what you need
vi.spyOn(database, 'query').mockResolvedValue(results);
```

2. **Reuse mocks across tests**:

```typescript
// Define mock once
const mockFetch = vi.fn();

// Reuse in multiple tests
beforeEach(() => {
  mockFetch.mockReset();
});
```

### Efficient Test Setup

Optimize your test setup for faster execution:

1. **Use `beforeAll` for expensive setup operations**:

```typescript
let testDatabase;

// Run once before all tests
beforeAll(async () => {
  testDatabase = await createTestDatabase();
});

// Clean up after all tests
afterAll(async () => {
  await testDatabase.close();
});
```

2. **Minimize DOM operations in React tests**:

```typescript
// Instead of mounting the full component tree
const { result } = renderHook(() => useMyHook());

// Instead of finding by text (slow)
const button = screen.getByRole('button', { name: 'Submit' });
```

## Environment Issues

### DOM Testing Problems

Issues with JSDOM environment in Vitest:

#### Problem:

```typescript
// Error: window is not defined
it('should interact with the DOM', () => {
  document.body.innerHTML = '<div id="root"></div>';
  expect(document.getElementById('root')).toBeTruthy();
});
```

#### Solution:

Ensure your Vitest config includes the JSDOM environment:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

### Timer Mocking Issues

Problems with timer mocks:

#### Problem:

```typescript
// Test times out
it('should handle setTimeout', async () => {
  setTimeout(() => {
    // This will never execute in the test
  }, 1000);
  
  await new Promise(resolve => setTimeout(resolve, 1100));
  expect(something).toBe(true);
});
```

#### Solution:

Use Vitest's timer mocks:

```typescript
it('should handle setTimeout', () => {
  vi.useFakeTimers();
  
  setTimeout(() => {
    // This will execute when we advance timers
  }, 1000);
  
  vi.advanceTimersByTime(1000);
  expect(something).toBe(true);
  
  vi.useRealTimers(); // Restore real timers
});
```

### Module Resolution Problems

Issues with module resolution in tests:

#### Problem:

```typescript
// Error: Cannot find module './styles.css'
import './styles.css';
```

#### Solution:

Configure module mocking in your Vitest config:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    deps: {
      inline: [/\.css$/],
    },
  },
});
```

And in your setup file:

```typescript
// src/setupTests.ts
vi.mock('*.css', () => ({}));
```
