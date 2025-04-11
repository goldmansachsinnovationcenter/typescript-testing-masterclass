/**
 * Example module that uses dynamic imports
 */

export class Calculator {
  async performOperation(operation: 'add' | 'subtract' | 'multiply' | 'divide', a: number, b: number): Promise<number> {
    const mathUtils = await import('./math-utils');
    
    switch (operation) {
      case 'add':
        return mathUtils.add(a, b);
      case 'subtract':
        return mathUtils.subtract(a, b);
      case 'multiply':
        return mathUtils.multiply(a, b);
      case 'divide':
        return mathUtils.divide(a, b);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }
}

export default Calculator;
