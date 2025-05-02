// src/services/authService.js

/**
 * Service for handling authentication-related API operations
 */

const API_URL = import.meta.env.VITE_API_URL;
// Add warning if not set
if (!API_URL) {
  console.error('VITE_API_URL is not set! Configure your environment variables.');
}
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
      // Add more detailed error handling
      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      throw new Error(`Failed to get user profile: ${response.status}`);
    }

    const userData = await response.json();
    
    // Update user info in localStorage with the latest data
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData.user));
    
    // Debug log to see if seller role is present
    console.log("Current user data:", userData);
    
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Refresh the authentication token to include updated role information
 * This is crucial after role changes like becoming a seller
 * @returns {Promise} - Response from the API with new token and user info
 */
export const refreshToken = async () => {
  try {
    // Get user credentials from storage
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.email) {
      throw new Error('User information not found');
    }
    
    // We need to get the saved password or use token-based refresh
    // Since we don't store passwords, we'll use the token to request a new one
    
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Request a new token using the /auth/token/refresh endpoint
    // NOTE: This endpoint needs to be implemented on your backend
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
      body: new URLSearchParams({
        'username': userInfo.email,
        'grant_type': 'refresh_token'
      })
    });
    
    if (!response.ok) {
      // If token refresh fails, try to re-authenticate user
      // This is a fallback measure that will prompt a new login
      console.warn("Token refresh failed, user may need to log in again");
      throw new Error('Token refresh failed. Please log in again.');
    }
    
    const data = await response.json();
    
    // Store the new token
    localStorage.setItem(TOKEN_KEY, data.access_token);
    
    // Also update user info if it's in the response
    if (data.user) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // If we can't refresh the token, the user needs to log in again
    logout();
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
    // For API requests that expect a JSON body
    return { 
      'Authorization': `Bearer ${token}` 
    };
  } else {
    return {};
  }
};
