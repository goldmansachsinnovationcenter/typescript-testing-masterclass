/**
 * Mock implementation of the utils module
 */
import { vi } from 'vitest';

export const generateId = vi.fn();
export const validateEmail = vi.fn();
export const formatDate = vi.fn();

export default {
  generateId,
  validateEmail,
  formatDate
};
