/**
 * This test file demonstrates how to mock files within the same package in Vitest
 * with TypeScript, focusing on avoiding hoisting-related errors.
 */

import { vi, MockedFunction } from 'vitest';

vi.mock('./utils');

import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from './user';
import type { User } from './user';

import { generateId, validateEmail, formatDate } from './utils';
const mockGenerateId = generateId as MockedFunction<typeof generateId>;
const mockValidateEmail = validateEmail as MockedFunction<typeof validateEmail>;
const mockFormatDate = formatDate as MockedFunction<typeof formatDate>;

describe('Same Package Mocking', () => {
  let userService: UserService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGenerateId.mockReturnValue('mocked-id-123');
    mockValidateEmail.mockReturnValue(true);
    
    userService = new UserService();
  });
  
  it('should mock the generateId function from utils', () => {
    const name = 'John Doe';
    const email = 'john@example.com';
    
    const user = userService.createUser(name, email);
    
    expect(mockGenerateId).toHaveBeenCalledTimes(1);
    expect(user.id).toBe('mocked-id-123');
  });
  
  it('should mock the validateEmail function from utils', () => {
    const name = 'Jane Doe';
    const email = 'jane@example.com';
    
    userService.createUser(name, email);
    
    expect(mockValidateEmail).toHaveBeenCalledTimes(1);
    expect(mockValidateEmail).toHaveBeenCalledWith(email);
  });
  
  it('should throw an error when validateEmail returns false', () => {
    mockValidateEmail.mockReturnValueOnce(false);
    const name = 'Invalid User';
    const email = 'invalid-email';
    
    expect(() => userService.createUser(name, email)).toThrow('Invalid email address');
    expect(mockValidateEmail).toHaveBeenCalledTimes(1);
    expect(mockValidateEmail).toHaveBeenCalledWith(email);
  });
  
  it('should allow changing mock implementation for specific tests', () => {
    const customId = 'custom-id-456';
    mockGenerateId.mockReturnValueOnce(customId);
    
    const user = userService.createUser('Custom User', 'custom@example.com');
    
    expect(user.id).toBe(customId);
    expect(mockGenerateId).toHaveBeenCalledTimes(1);
  });
  
  it('should create multiple users with different mocked IDs', () => {
    mockGenerateId
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');
    
    const user1 = userService.createUser('User 1', 'user1@example.com');
    const user2 = userService.createUser('User 2', 'user2@example.com');
    
    expect(mockGenerateId).toHaveBeenCalledTimes(2);
    expect(user1.id).toBe('id-1');
    expect(user2.id).toBe('id-2');
  });
  
  it('should store and retrieve users correctly', () => {
    const user = userService.createUser('Test User', 'test@example.com');
    
    const retrievedUser = userService.getUserById(user.id);
    const allUsers = userService.getAllUsers();
    
    expect(retrievedUser).toEqual(user);
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0]).toEqual(user);
  });
});
