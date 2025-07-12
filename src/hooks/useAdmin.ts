import { useState } from 'react';

// Admin authentication with new credentials
const ADMIN_CREDENTIALS = {
  username: 'mee',
  password: 'GalaNight@123'
};

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        localStorage.setItem('dac_admin_session', JSON.stringify({
          username: username,
          timestamp: Date.now(),
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dac_admin_session');
    
    // Clear any admin-specific data
    localStorage.removeItem('dac_admin_preferences');
  };

  const checkAuth = async () => {
    const session = localStorage.getItem('dac_admin_session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        
        // Session expires after 8 hours for security
        if (sessionAge < 8 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('dac_admin_session');
          localStorage.removeItem('dac_admin_preferences');
        }
      } catch (error) {
        localStorage.removeItem('dac_admin_session');
        localStorage.removeItem('dac_admin_preferences');
      }
    }
  };

  const getSessionInfo = () => {
    const session = localStorage.getItem('dac_admin_session');
    if (session) {
      try {
        return JSON.parse(session);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
    getSessionInfo
  };
};