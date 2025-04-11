/**
 * This test file demonstrates how to mock indirect module dependencies in Vitest
 * with TypeScript, focusing on avoiding hoisting-related errors.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from './user-repository';
import DbClient from './db-client';
import Database from './database';

const mockQuery = vi.fn();
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('./database', () => {
  const MockDatabase = vi.fn().mockImplementation(() => {
    return {
      connect: mockConnect,
      query: mockQuery,
      disconnect: mockDisconnect
    };
  });
  
  return {
    default: MockDatabase,
    Database: MockDatabase
  };
});

describe('Indirect Module Dependencies Mocking', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
  ];
  
  let dbClient: DbClient;
  let userRepository: UserRepository;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockConnect.mockResolvedValue(undefined);
    mockQuery.mockResolvedValue(mockUsers);
    mockDisconnect.mockResolvedValue(undefined);
    
    dbClient = new DbClient({
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test'
    });
    
    userRepository = new UserRepository(dbClient);
  });
  
  it('should mock the Database class used by DbClient', async () => {
    const users = await userRepository.findUsersByName('Doe');
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE name LIKE ?', ['%Doe%']);
    expect(users).toEqual(mockUsers);
  });
  
  it('should allow changing mock implementation for specific tests', async () => {
    const customUsers = [{ id: 3, name: 'Custom User', email: 'custom@example.com' }];
    mockQuery.mockResolvedValueOnce(customUsers);
    
    const users = await userRepository.findUsersByName('Custom');
    
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(users).toEqual(customUsers);
  });
  
  it('should handle mock errors correctly', async () => {
    const error = new Error('Database query failed');
    mockQuery.mockRejectedValueOnce(error);
    
    await expect(userRepository.findUsersByName('Error')).rejects.toThrow('Database query failed');
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
  
  it('should verify the order of function calls', async () => {
    await userRepository.findUsersByName('Doe');
    
    expect(mockConnect.mock.invocationCallOrder[0]).toBeLessThan(mockQuery.mock.invocationCallOrder[0]);
  });
});
