/**
 * Mock implementation of the api module
 */
import { vi } from 'vitest';

export const fetchData = vi.fn();
export const postData = vi.fn();

export default {
  fetchData,
  postData,
};
