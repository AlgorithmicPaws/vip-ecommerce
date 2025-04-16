// src/services/apiService.js

import { authHeader } from './authService';

/**
 * Service for handling API requests with authentication
 */

// Base API URL - In a real application, this would come from environment variables
const API_URL = 'http://localhost:8000';

/**
 * Generic HTTP GET request with authentication
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response from the API
 */
export const get = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Generic HTTP POST request with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to be sent in the request body
 * @returns {Promise} - Response from the API
 */
export const post = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del backend:", errorData); // 👈 Muestra detalles
      throw new Error(
        errorData.detail || 
        errorData.message || 
        JSON.stringify(errorData.errors) || // 👈 Para validaciones de campos
        `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
};

/**
 * Generic HTTP PUT request with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to be sent in the request body
 * @returns {Promise} - Response from the API
 */
export const put = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Generic HTTP DELETE request with authentication
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response from the API
 */
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // For DELETE operations that return 204 No Content
    if (response.status === 204) {
      return true;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting from ${endpoint}:`, error);
    throw error;
  }
};