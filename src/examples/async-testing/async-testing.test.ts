/**
 * This test file demonstrates techniques for testing asynchronous code
 * with Vitest and TypeScript, focusing on promises, async/await, and race conditions.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient, User } from './api-client';

describe('Testing Asynchronous Code', () => {
  let apiClient: ApiClient;
  
  beforeEach(() => {
    apiClient = new ApiClient();
    
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  
  describe('Basic Promise Testing', () => {
    it('should resolve with user data for valid ID', async () => {
      const userId = 1;
      
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const promise = apiClient.getUser(userId);
      
      vi.runAllTimers();
      
      await expect(promise).resolves.toEqual(expect.objectContaining({
        data: expect.objectContaining({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`
        }),
        status: 200
      }));
    });
    
    it('should reject for invalid user ID', async () => {
      const userId = -1;
      
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const promise = apiClient.getUser(userId);
      
      vi.runAllTimers();
      
      await expect(promise).rejects.toThrow('User not found');
    });
    
    it.skip('should handle promise rejection with try/catch', async () => {
      const userId = -1;
      
      vi.runAllTimers();
      
      try {
        await apiClient.getUser(userId);
        expect.fail('Promise should have been rejected');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('User not found');
      }
    });
  });
  
  describe('Testing Async/Await Functions', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const promise = apiClient.createUser(userData);
      vi.runAllTimers();
      const result = await promise;
      
      expect(result.status).toBe(201);
      expect(result.data).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: userData.name,
        email: userData.email
      }));
    });
    
    it('should throw for invalid user data', async () => {
      const invalidUserData = {
        name: '',
        email: 'john@example.com'
      };
      
      const createPromise = apiClient.createUser(invalidUserData);
      vi.runAllTimers();
      
      await expect(createPromise).rejects.toThrow('Invalid user data');
    });
  });
  
  describe('Testing Concurrent Operations', () => {
    it('should fetch multiple users concurrently', async () => {
      const userIds = [1, 2, 3];
      
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const promise = apiClient.getUsers(userIds);
      vi.runAllTimers();
      const result = await promise;
      
      expect(result.data).toHaveLength(userIds.length);
      expect(result.data[0].id).toBe(userIds[0]);
      expect(result.data[1].id).toBe(userIds[1]);
      expect(result.data[2].id).toBe(userIds[2]);
    });
    
    it('should handle errors in concurrent operations', async () => {
      const userIds = [1, -1, 3]; // One invalid ID
      
      const promise = apiClient.getUsers(userIds);
      vi.runAllTimers();
      
      await expect(promise).rejects.toThrow('Failed to fetch users');
    });
  });
  
  describe('Testing Race Conditions', () => {
    it('should handle timeout race conditions', async () => {
      const userId = 1;
      
      const getUserSpy = vi.spyOn(apiClient as any, 'getUser');
      getUserSpy.mockImplementationOnce(async () => {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Very long delay
        return { data: { id: userId, name: 'User 1', email: 'user1@example.com' } };
      });
      
      const promise = apiClient.getUserWithTimeout(userId);
      
      vi.advanceTimersByTime(6000);
      
      const result = await promise;
      expect(result).toBeNull();
    });
    
    it('should return data when request completes before timeout', async () => {
      const userId = 1;
      
      const getUserSpy = vi.spyOn(apiClient as any, 'getUser');
      getUserSpy.mockResolvedValueOnce({
        data: { id: userId, name: 'User 1', email: 'user1@example.com' },
        status: 200,
        message: 'Success'
      });
      
      const promise = apiClient.getUserWithTimeout(userId);
      
      vi.runAllTimers();
      
      const result = await promise;
      expect(result).not.toBeNull();
      expect(result?.data.id).toBe(userId);
    });
  });
  
  describe('Advanced Timer Techniques', () => {
    it('should test sequential async operations with runOnlyPendingTimers', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const createUserSpy = vi.spyOn(apiClient, 'createUser');
      const userData = { name: 'Test User', email: 'test@example.com' };
      
      const createPromise = apiClient.createUser(userData);
      
      vi.runOnlyPendingTimers();
      
      await createPromise;
      
      const getUserPromise = apiClient.getUser(1);
      
      vi.runOnlyPendingTimers();
      
      await getUserPromise;
      expect(createUserSpy).toHaveBeenCalledTimes(1);
    });
    
    it('should test with advanceTimersToNextTimer', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      
      const getUserSpy = vi.spyOn(apiClient, 'getUser');
      
      const promise = apiClient.getUser(1);
      
      vi.advanceTimersToNextTimer();
      
      await promise;
      expect(getUserSpy).toHaveBeenCalledTimes(1);
    });
  });
});
