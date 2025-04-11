/**
 * Example component that uses the theme context
 */
import React from 'react';
import { useTheme } from './ThemeContext';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const ThemedButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  const { isDark, toggleTheme } = useTheme();
  
  const buttonStyle = {
    backgroundColor: isDark ? '#333' : '#f0f0f0',
    color: isDark ? '#fff' : '#000',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  return (
    <button 
      style={buttonStyle} 
      onClick={onClick || toggleTheme}
      data-testid="themed-button"
    >
      {children}
    </button>
  );
};

export const ThemedPage: React.FC = () => {
  const { mode, isDark, setMode } = useTheme();
  
  const containerStyle = {
    backgroundColor: isDark ? '#222' : '#fff',
    color: isDark ? '#fff' : '#000',
    padding: '20px',
    minHeight: '200px',
    borderRadius: '8px'
  };
  
  return (
    <div style={containerStyle} data-testid="themed-page">
      <h1>Themed Page</h1>
      <p>Current theme: {mode}</p>
      
      <div>
        <button 
          onClick={() => setMode('light')}
          data-testid="light-mode-button"
          style={{ marginRight: '10px' }}
        >
          Light Mode
        </button>
        <button 
          onClick={() => setMode('dark')}
          data-testid="dark-mode-button"
          style={{ marginRight: '10px' }}
        >
          Dark Mode
        </button>
        <button 
          onClick={() => setMode('system')}
          data-testid="system-mode-button"
        >
          System Mode
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <ThemedButton>Toggle Theme</ThemedButton>
      </div>
    </div>
  );
};

export default ThemedPage;
