/**
 * Example of a React component that will be lazy-loaded
 */
import React from 'react';

interface LazyComponentProps {
  title: string;
  onAction: () => void;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="lazy-component">
      <h2>{title}</h2>
      <button onClick={onAction}>Click me</button>
    </div>
  );
};

export default LazyComponent;
