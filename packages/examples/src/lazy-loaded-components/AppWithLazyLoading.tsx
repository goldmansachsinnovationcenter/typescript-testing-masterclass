/**
 * Example of a React component that uses lazy loading
 */
import React, { lazy, Suspense, useState } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

interface AppWithLazyLoadingProps {
  initialTitle?: string;
}

const AppWithLazyLoading: React.FC<AppWithLazyLoadingProps> = ({ 
  initialTitle = 'Lazy Loaded Component' 
}) => {
  const [count, setCount] = useState(0);
  const [showLazyComponent, setShowLazyComponent] = useState(false);

  const handleAction = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div className="app">
      <h1>App with Lazy Loading</h1>
      <p>Count: {count}</p>
      
      <button onClick={() => setShowLazyComponent(prev => !prev)}>
        {showLazyComponent ? 'Hide' : 'Show'} Lazy Component
      </button>
      
      {showLazyComponent && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent 
            title={`${initialTitle} (${count})`} 
            onAction={handleAction} 
          />
        </Suspense>
      )}
    </div>
  );
};

export default AppWithLazyLoading;
