/**
 * Example module used for demonstrating mocking techniques
 * in the common-issues.test.ts file
 */

export const exampleFunction = (): string => {
  return 'real value';
};

export const fetchData = async (): Promise<{ data: string }> => {
  return { data: 'real data' };
};
