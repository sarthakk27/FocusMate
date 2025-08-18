import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Get CSRF token first
      await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
      // Then check auth status
      await checkAuthStatus();
    } catch (error) {
      console.error('App initialization error:', error);
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
