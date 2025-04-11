/**
 * This test file demonstrates how to mock direct module imports in Vitest
 * with TypeScript, focusing on avoiding hoisting-related errors.
 */

import { vi, MockedFunction } from 'vitest';

vi.mock('./api');

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import userService, { getUser, createUser, getUserWithDefaultApi } from './user-service';
import type { User } from './user-service';

import { fetchData, postData } from './api';
const mockFetchData = fetchData as MockedFunction<typeof fetchData>;
const mockPostData = postData as MockedFunction<typeof postData>;

describe('Direct Module Import Mocking', () => {
  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    mockFetchData.mockReset();
    mockPostData.mockReset();
    
    mockFetchData.mockResolvedValue(mockUser);
    mockPostData.mockResolvedValue({ ...mockUser, id: 2 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should mock named import fetchData function', async () => {
    const result = await getUser(1);
    
    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith('https://api.example.com/users/1');
    expect(result).toEqual(mockUser);
  });

  it('should mock named import postData function', async () => {
    const newUser = { name: 'New User', email: 'new@example.com' };
    
    const result = await createUser(newUser);
    
    expect(mockPostData).toHaveBeenCalledTimes(1);
    expect(mockPostData).toHaveBeenCalledWith('https://api.example.com/users', newUser);
    expect(result).toEqual({ ...mockUser, id: 2 });
  });

  it('should mock default import api.fetchData function', async () => {
    const result = await getUserWithDefaultApi(1);
    
    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith('https://api.example.com/users/1');
    expect(result).toEqual(mockUser);
  });

  it('should allow changing mock implementation for specific tests', async () => {
    const customUser = { ...mockUser, name: 'Custom User' };
    mockFetchData.mockResolvedValueOnce(customUser);
    
    const result = await getUser(1);
    
    expect(result).toEqual(customUser);
    expect(mockFetchData).toHaveBeenCalledTimes(1);
  });

  it('should allow spying on mock calls across multiple tests', async () => {
    await userService.getUser(1);
    await userService.getUserWithDefaultApi(2);
    
    expect(mockFetchData).toHaveBeenCalledTimes(2);
    expect(mockFetchData.mock.calls).toEqual([
      ['https://api.example.com/users/1'],
      ['https://api.example.com/users/2']
    ]);
  });
});
