/**
 * Enhanced API client with improved type safety and error handling
 * This demonstrates advanced TypeScript patterns for robust async code
 */

export type UserId = number & { readonly __brand: unique symbol };
export type Email = string & { readonly __brand: unique symbol };

export const createUserId = (id: number): UserId => {
  if (id <= 0) {
    throw new Error('User ID must be a positive number');
  }
  return id as UserId;
};

export const createEmail = (email: string): Email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email as Email;
};

export type ApiResult<T> = 
  | { status: 'success'; data: T; code: number; message: string }
  | { status: 'error'; error: Error; code: number; message: string };

export interface User {
  id: UserId;
  name: string;
  email: Email;
}

export type RequestState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export class EnhancedApiClient {
  private baseUrl: string;
  private timeout: number;
  
  constructor(baseUrl: string = 'https://api.example.com', timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  
  /**
   * Fetches a user by ID with improved type safety
   * @param id User ID (branded type)
   * @returns Promise with discriminated union result
   */
  async getUser(id: UserId): Promise<ApiResult<User>> {
    try {
      await delay(300);
      
      if (Math.random() < 0.1) {
        throw new TimeoutError();
      }
      
      return {
        status: 'success',
        data: {
          id,
          name: `User ${id}`,
          email: createEmail(`user${id}@example.com`)
        },
        code: 200,
        message: 'Success'
      };
    } catch (error) {
      if (error instanceof TimeoutError) {
        return {
          status: 'error',
          error,
          code: 408,
          message: 'Request timeout'
        };
      }
      
      if (error instanceof Error) {
        return {
          status: 'error',
          error,
          code: 500,
          message: error.message
        };
      }
      
      return {
        status: 'error',
        error: new Error('Unknown error'),
        code: 500,
        message: 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Creates a new user with validation
   * @param userData User data to create
   * @returns Promise with discriminated union result
   */
  async createUser(userData: Omit<User, 'id'>): Promise<ApiResult<User>> {
    try {
      await delay(500);
      
      const id = createUserId(Math.floor(Math.random() * 1000) + 1);
      
      const newUser: User = {
        ...userData,
        id
      };
      
      return {
        status: 'success',
        data: newUser,
        code: 201,
        message: 'User created successfully'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 'error',
          error,
          code: 400,
          message: error.message
        };
      }
      
      return {
        status: 'error',
        error: new Error('Unknown error'),
        code: 500,
        message: 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Fetches multiple users concurrently with improved error handling
   * @param ids Array of user IDs
   * @returns Promise with discriminated union result
   */
  async getUsers(ids: UserId[]): Promise<ApiResult<User[]>> {
    try {
      const userPromises = ids.map(id => this.getUserData(id));
      const users = await Promise.all(userPromises);
      
      return {
        status: 'success',
        data: users,
        code: 200,
        message: 'Success'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 'error',
          error,
          code: 500,
          message: `Failed to fetch users: ${error.message}`
        };
      }
      
      return {
        status: 'error',
        error: new Error('Unknown error'),
        code: 500,
        message: 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Helper method that returns just the user data
   * Made protected for testing purposes
   */
  public async getUserData(id: UserId): Promise<User> {
    const response = await this.getUser(id);
    if (response.status === 'error') {
      throw response.error;
    }
    return response.data;
  }
  
  /**
   * Fetches a user with timeout using Promise.race
   * @param id User ID
   * @returns Promise with discriminated union result or null if timeout
   */
  async getUserWithTimeout(id: UserId): Promise<ApiResult<User> | null> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new TimeoutError()), this.timeout);
      });
      
      const result = await Promise.race([
        this.getUser(id),
        timeoutPromise
      ]);
      
      return result;
    } catch (error) {
      console.error('Request failed:', error);
      return null;
    }
  }
  
  /**
   * Demonstrates handling of race conditions with cancellation
   * @param id User ID
   * @returns Promise with request state updates
   */
  async getUserWithCancellation(id: UserId, signal: AbortSignal): Promise<ApiResult<User>> {
    try {
      if (signal.aborted) {
        throw new Error('Request was cancelled');
      }
      
      const abortPromise = new Promise<never>((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new Error('Request was cancelled'));
        });
      });
      
      await Promise.race([
        delay(300),
        abortPromise
      ]);
      
      if (signal.aborted) {
        throw new Error('Request was cancelled');
      }
      
      return {
        status: 'success',
        data: {
          id,
          name: `User ${id}`,
          email: createEmail(`user${id}@example.com`)
        },
        code: 200,
        message: 'Success'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 'error',
          error,
          code: error.message.includes('cancelled') ? 499 : 500,
          message: error.message
        };
      }
      
      return {
        status: 'error',
        error: new Error('Unknown error'),
        code: 500,
        message: 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Demonstrates handling of multiple concurrent requests with a limit
   * @param ids Array of user IDs
   * @param concurrencyLimit Maximum number of concurrent requests
   * @returns Promise with discriminated union result
   */
  async getUsersWithConcurrencyLimit(
    ids: UserId[], 
    concurrencyLimit: number = 3
  ): Promise<ApiResult<User[]>> {
    try {
      const results: User[] = [];
      
      for (let i = 0; i < ids.length; i += concurrencyLimit) {
        const batch = ids.slice(i, i + concurrencyLimit);
        const batchPromises = batch.map(id => this.getUserData(id));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }
      
      return {
        status: 'success',
        data: results,
        code: 200,
        message: 'Success'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 'error',
          error,
          code: 500,
          message: `Failed to fetch users: ${error.message}`
        };
      }
      
      return {
        status: 'error',
        error: new Error('Unknown error'),
        code: 500,
        message: 'Unknown error occurred'
      };
    }
  }
}

export default EnhancedApiClient;
