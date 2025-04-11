/**
 * Example utility module that will be mocked within the same package
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default {
  generateId,
  formatDate,
  validateEmail
};
