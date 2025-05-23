/**
 * Example of an accessible form component
 * This demonstrates accessibility best practices for React forms
 */
import React, { useState, useRef, useId } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  subscribe: boolean;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export const AccessibleForm: React.FC<FormProps> = ({ 
  onSubmit,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    priority: 'medium',
    subscribe: false,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const priorityId = useId();
  const subscribeId = useId();
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  const focusFirstError = () => {
    if (errors.name) {
      nameInputRef.current?.focus();
    }
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    setSubmitted(true);
    
    if (isValid) {
      onSubmit(formData);
      submitButtonRef.current?.focus();
      
      const successMessage = document.getElementById('form-success-message');
      if (successMessage) {
        successMessage.textContent = 'Form submitted successfully!';
      }
    } else {
      focusFirstError();
    }
  };
  
  return (
    <div className="accessible-form-container">
      <h2 id="form-heading">Contact Us</h2>
      
      {/* Success message for screen readers */}
      <div 
        id="form-success-message" 
        className="sr-only" 
        aria-live="polite"
        data-testid="success-message"
      ></div>
      
      <form 
        onSubmit={handleSubmit} 
        aria-labelledby="form-heading"
        noValidate
        data-testid="accessible-form"
      >
        <div className="form-group">
          <label htmlFor={nameId}>
            Name
            <span aria-hidden="true" className="required-indicator">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id={nameId}
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            data-testid="name-input"
          />
          {errors.name && (
            <div 
              id={`${nameId}-error`} 
              className="error-message" 
              aria-live="polite"
              data-testid="name-error"
            >
              {errors.name}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor={emailId}>
            Email
            <span aria-hidden="true" className="required-indicator">*</span>
          </label>
          <input
            type="email"
            id={emailId}
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            data-testid="email-input"
          />
          {errors.email && (
            <div 
              id={`${emailId}-error`} 
              className="error-message" 
              aria-live="polite"
              data-testid="email-error"
            >
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor={messageId}>
            Message
            <span aria-hidden="true" className="required-indicator">*</span>
          </label>
          <textarea
            id={messageId}
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            data-testid="message-input"
          ></textarea>
          {errors.message && (
            <div 
              id={`${messageId}-error`} 
              className="error-message" 
              aria-live="polite"
              data-testid="message-error"
            >
              {errors.message}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor={priorityId}>Priority</label>
          <select
            id={priorityId}
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            data-testid="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id={subscribeId}
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            data-testid="subscribe-checkbox"
          />
          <label htmlFor={subscribeId}>
            Subscribe to newsletter
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            ref={submitButtonRef}
            data-testid="submit-button"
          >
            Submit
          </button>
        </div>
        
        {submitted && Object.keys(errors).length === 0 && (
          <div 
            className="success-message" 
            role="status"
            data-testid="visible-success-message"
          >
            Form submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AccessibleForm;
