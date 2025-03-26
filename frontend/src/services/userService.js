// src/services/userService.js

/**
 * Service for handling user-related API operations
 */

// Base API URL - In a real application, this would come from environment variables
const API_URL = 'http://localhost:8000';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from the API
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the request was successful
    if (!response.ok) {
      // Parse error response if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      } catch (e) {
        throw new Error(`Registration failed: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Response from the API
 */
export const loginUser = async (credentials) => {
  // Implementation for future use
};

/**
 * Get user profile
 * @param {string} token - Authentication token
 * @returns {Promise} - Response from the API
 */
export const getUserProfile = async (token) => {
  // Implementation for future use
};