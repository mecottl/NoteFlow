import { useState, useEffect } from 'react';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('userId');
  });
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(
        !!localStorage.getItem('token') && !!localStorage.getItem('userId')
      );
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return isAuthenticated;
}
