/**
 * Example service that uses the API module
 */
import api, { fetchData, postData } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const getUser = async (id: number): Promise<User> => {
  return fetchData<User>(`https://api.example.com/users/${id}`);
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  return postData<User>('https://api.example.com/users', userData);
};

export const getUserWithDefaultApi = async (id: number): Promise<User> => {
  return api.fetchData<User>(`https://api.example.com/users/${id}`);
};

export default {
  getUser,
  createUser,
  getUserWithDefaultApi,
};
