/**
 * Example component that uses React Suspense for data fetching
 */
import React, { Suspense, useState } from 'react';

interface ResourceCache<T> {
  read: () => T;
}

export function createResource<T>(promise: Promise<T>): ResourceCache<T> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: Error;
  
  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (e) => {
      status = 'error';
      error = e;
    }
  );
  
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else {
        return result;
      }
    }
  };
}

export const api = {
  fetchUser: async (id: number): Promise<{ id: number; name: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (id === 0) {
      throw new Error('User not found');
    }
    
    return { id, name: `User ${id}` };
  }
};

interface UserDetailsProps {
  resource: ResourceCache<{ id: number; name: string }>;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ resource }) => {
  const user = resource.read();
  
  return (
    <div data-testid="user-details">
      <h2>User Details</h2>
      <p data-testid="user-id">ID: {user.id}</p>
      <p data-testid="user-name">Name: {user.name}</p>
    </div>
  );
};

export const LoadingFallback: React.FC = () => (
  <div data-testid="loading-fallback">
    <h2>Loading...</h2>
    <div className="spinner"></div>
  </div>
);

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div data-testid="error-fallback" role="alert">
    <h2>Something went wrong:</h2>
    <pre data-testid="error-message">{error.message}</pre>
    <button onClick={resetErrorBoundary} data-testid="retry-button">
      Try again
    </button>
  </div>
);

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onReset?: () => void;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };
  
  render() {
    if (this.state.hasError && this.state.error) {
      if (React.isValidElement(this.props.fallback)) {
        return this.props.fallback;
      }
      
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }
    
    return this.props.children;
  }
}

export const UserProfile: React.FC = () => {
  const [userId, setUserId] = useState<number>(1);
  const [resource, setResource] = useState(() => 
    createResource(api.fetchUser(userId))
  );
  
  const handleLoadUser = (id: number) => {
    setUserId(id);
    setResource(createResource(api.fetchUser(id)));
  };
  
  return (
    <div data-testid="user-profile">
      <h1>User Profile</h1>
      
      <div>
        <button 
          onClick={() => handleLoadUser(1)}
          data-testid="load-user-1"
        >
          Load User 1
        </button>
        <button 
          onClick={() => handleLoadUser(2)}
          data-testid="load-user-2"
        >
          Load User 2
        </button>
        <button 
          onClick={() => handleLoadUser(0)}
          data-testid="load-invalid-user"
        >
          Load Invalid User
        </button>
      </div>
      
      <ErrorBoundary
        fallback={<ErrorFallback error={new Error('')} resetErrorBoundary={() => handleLoadUser(1)} />}
        onReset={() => handleLoadUser(1)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <UserDetails resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default UserProfile;
