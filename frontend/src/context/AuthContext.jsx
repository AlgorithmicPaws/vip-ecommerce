import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if user info exists in localStorage
        const storedUser = authService.getUserInfo();
        
        if (storedUser) {
          // Verify if token is still valid
          const { valid } = await authService.verifyToken();
          
          if (valid) {
            // Get fresh user data from API
            const userData = await authService.getCurrentUser();
            setUser({
              ...userData.user,
              roles: userData.roles,
              isSeller: userData.is_seller
            });
          } else {
            // If token is invalid, log out
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser({
        ...data.user,
        roles: data.roles,
        isSeller: data.is_seller
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function (uses existing userService)
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // This will be implemented in userService
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isSeller: user?.isSeller || false,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};