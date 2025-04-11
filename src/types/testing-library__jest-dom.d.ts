import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toBeVisible(): void;
      toBeChecked(): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeEmpty(): void;
      toBeEmptyDOMElement(): void;
      toBeInvalid(): void;
      toBeRequired(): void;
      toBeValid(): void;
      toContainElement(element: HTMLElement | null): void;
      toContainHTML(htmlText: string): void;
      toHaveAccessibleDescription(description?: string | RegExp): void;
      toHaveAccessibleName(name?: string | RegExp): void;
      toHaveAttribute(attr: string, value?: any): void;
      toHaveClass(...classNames: string[]): void;
      toHaveFocus(): void;
      toHaveFormValues(values: Record<string, any>): void;
      toHaveStyle(css: string | Record<string, any>): void;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): void;
      toHaveValue(value?: string | string[] | number): void;
      toBeInTheDocument(): void;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): void;
    }
  }
}
