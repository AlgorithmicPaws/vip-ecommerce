// src/services/authService.js

/**
 * Service for handling authentication-related API operations
 */

// Base API URL - In a real application, this would come from environment variables
const API_URL = 'http://localhost:8000';

// Token key for localStorage
const TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';

/**
 * Login user with email and password
 * @param {Object} credentials - User login credentials (email and password)
 * @returns {Promise} - Response from the API with token and user info
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Parse error response if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      } catch (e) {
        throw new Error(`Login failed: ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Store token and user info in localStorage
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} - The JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get user info from localStorage
 * @returns {Object|null} - User info object or null if not found
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Check if user has seller role
 * @returns {boolean} - True if user has seller role
 */
export const isSeller = () => {
  const userInfo = getUserInfo();
  return userInfo?.roles?.includes('seller') || false;
};

/**
 * Logout user by removing token and user info from localStorage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};

/**
 * Verify if current token is still valid
 * @returns {Promise} - Response from the API
 */
export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { valid: false };
    }

    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { valid: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false };
  }
};

/**
 * Get current user profile information
 * @returns {Promise} - Response from the API with user profile
 */
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/user-info/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.status}`);
    }

    const userData = await response.json();
    
    // Update user info in localStorage
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData.user));
    
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Create API headers with authentication token
 * @returns {Object} - Headers object with Authorization if token exists
 */
export const authHeader = () => {
  const token = getToken();
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
};