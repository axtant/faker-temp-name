import { useState, useEffect } from 'react';
import authService from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    authService.steamLogin();
  };

  const logout = async () => {
    try {
      // Clear token/session from backend
      await authService.logout();
      
      // Clear local storage/cookies
      localStorage.removeItem('token');
      
      // Clear user state
      setUser(null);
      navigate('/');
      
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  return { user, loading, login, logout, checkAuth };
};