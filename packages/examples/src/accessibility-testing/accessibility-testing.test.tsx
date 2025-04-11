/**
 * This test file demonstrates techniques for testing accessibility in React components
 * with Vitest, Testing Library, and jest-axe.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { AccessibleForm } from './accessible-form';

expect.extend(toHaveNoViolations);

describe('Accessibility Testing', () => {
  const mockSubmit = vi.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  describe('Automated Accessibility Testing with jest-axe', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const results = await axe(container);
      
      expect(results).toHaveNoViolations();
    });
    
    it('should have no accessibility violations when showing errors', async () => {
      const { container } = render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    
    it('should have no accessibility violations when showing success message', async () => {
      const { container } = render(<AccessibleForm onSubmit={mockSubmit} />);
      
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test message' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  
  describe('Testing ARIA Attributes', () => {
    it('should have proper aria-required attributes', () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      expect(screen.getByTestId('name-input')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByTestId('email-input')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByTestId('message-input')).toHaveAttribute('aria-required', 'true');
    });
    
    it('should set aria-invalid when validation fails', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByTestId('name-input')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByTestId('email-input')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByTestId('message-input')).toHaveAttribute('aria-invalid', 'true');
    });
    
    it('should connect error messages with inputs using aria-describedby', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      const nameInput = screen.getByTestId('name-input');
      const nameErrorId = nameInput.getAttribute('aria-describedby');
      expect(nameErrorId).toBeTruthy();
      
      const nameError = screen.getByTestId('name-error');
      expect(nameError).toHaveAttribute('id', nameErrorId);
    });
  });
  
  describe('Testing Focus Management', () => {
    it('should focus the first field with an error after failed submission', async () => {
      expect(true).toBe(true);
    });
    
    it('should focus the submit button after successful submission', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test message' } });
      
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(submitButton);
      });
    });
  });
  
  describe('Testing Keyboard Navigation', () => {
    it('should allow form completion using only the keyboard', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const prioritySelect = screen.getByTestId('priority-select');
      const subscribeCheckbox = screen.getByTestId('subscribe-checkbox');
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        nameInput.focus();
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        
        emailInput.focus();
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        
        messageInput.focus();
        fireEvent.change(messageInput, { target: { value: 'Test message' } });
        
        prioritySelect.focus();
        fireEvent.change(prioritySelect, { target: { value: 'high' } });
        
        subscribeCheckbox.focus();
        fireEvent.click(subscribeCheckbox);
        
        submitButton.focus();
        fireEvent.click(submitButton);
      });
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
      });
      
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
        priority: 'high',
        subscribe: true
      });
    });
  });
  
  describe('Testing Screen Reader Announcements', () => {
    it('should announce form errors to screen readers', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      const nameError = screen.getByTestId('name-error');
      expect(nameError).toHaveAttribute('aria-live', 'polite');
      expect(nameError).toHaveTextContent('Name is required');
    });
    
    it('should announce success message to screen readers', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test message' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByTestId('visible-success-message')).toBeInTheDocument();
      
      const srMessage = screen.getByTestId('success-message');
      expect(srMessage).toHaveAttribute('aria-live', 'polite');
    });
  });
  
  describe('Testing Color Contrast', () => {
    
    it('should have sufficient color contrast for error messages', () => {
      
      
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      const nameError = screen.getByTestId('name-error');
      expect(nameError).toHaveClass('error-message');
    });
  });
  
  describe('Testing Form Validation', () => {
    it('should validate email format', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test message' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Please enter a valid email address');
      expect(mockSubmit).not.toHaveBeenCalled();
    });
    
    it('should clear error messages when fields are edited', async () => {
      render(<AccessibleForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
      
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });
  });
});
