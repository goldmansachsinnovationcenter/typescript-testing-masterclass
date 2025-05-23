/**
 * Example component that uses useEffect for various scenarios
 */
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

interface Props {
  userId?: number;
  onDataLoad?: (data: User | null) => void;
  onError?: (error: Error) => void;
}

export const api = {
  fetchUser: async (id: number): Promise<User> => {
    return { id, name: `User ${id}` };
  }
};

export const UserProfile: React.FC<Props> = ({ userId, onDataLoad, onError }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number>(0);
  
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        const data = await api.fetchUser(userId);
        
        if (isMounted) {
          setUser(data);
          setLoading(false);
          onDataLoad?.(data);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setLoading(false);
          onError?.(error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [userId, onDataLoad, onError]);
  
  useEffect(() => {
    document.title = user ? `Profile: ${user.name}` : 'User Profile';
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }
  
  if (error) {
    return <div data-testid="error">Error: {error.message}</div>;
  }
  
  if (!user) {
    return <div data-testid="no-user">No user selected</div>;
  }
  
  return (
    <div data-testid="user-profile">
      <h1>{user.name}</h1>
      <p>ID: {user.id}</p>
      <p data-testid="counter">Counter: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default UserProfile;
