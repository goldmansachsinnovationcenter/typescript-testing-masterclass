/**
 * Example API client with asynchronous methods
 * This demonstrates common patterns for asynchronous code in TypeScript
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  
  constructor(baseUrl: string = 'https://api.example.com', timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  
  /**
   * Fetches a user by ID
   * @param id User ID
   * @returns Promise with user data
   * @throws Error if request times out or fails
   */
  async getUser(id: number): Promise<ApiResponse<User>> {
    await delay(300);
    
    if (Math.random() < 0.1) {
      throw new Error('Request timed out');
    }
    
    if (id <= 0) {
      throw new Error('User not found');
    }
    
    return {
      data: {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`
      },
      status: 200,
      message: 'Success'
    };
  }
  
  /**
   * Creates a new user
   * @param user User data
   * @returns Promise with created user
   */
  async createUser(user: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    await delay(500);
    
    if (!user.name || !user.email) {
      throw new Error('Invalid user data');
    }
    
    const newUser: User = {
      ...user,
      id: Math.floor(Math.random() * 1000) + 1
    };
    
    return {
      data: newUser,
      status: 201,
      message: 'User created successfully'
    };
  }
  
  /**
   * Fetches multiple users concurrently
   * @param ids Array of user IDs
   * @returns Promise with array of users
   */
  async getUsers(ids: number[]): Promise<ApiResponse<User[]>> {
    try {
      const userPromises = ids.map(id => this.getUserWithoutResponse(id));
      const users = await Promise.all(userPromises);
      
      return {
        data: users,
        status: 200,
        message: 'Success'
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Helper method that returns just the user data without the API response wrapper
   */
  private async getUserWithoutResponse(id: number): Promise<User> {
    const response = await this.getUser(id);
    return response.data;
  }
  
  /**
   * Fetches a user with timeout
   * @param id User ID
   * @returns Promise with user data or null if timeout
   */
  async getUserWithTimeout(id: number): Promise<ApiResponse<User> | null> {
    try {
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), this.timeout);
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
}

export default ApiClient;
