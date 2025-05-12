// src/services/apiService.js
import { authHeader } from './authService';

/**
 * Service for handling API requests with authentication
 */

// Base API URL
const API_URL = import.meta.env.VITE_API_URL|| 'http://vipscm.shop/api';;
// Add warning if not set
if (!API_URL) {
  console.error('VITE_API_URL is not set! Configure your environment variables.');
}

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

    // Check content type for better error handling
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData);
      
      const errorMessage = 
        typeof responseData === 'object' && responseData.detail
          ? responseData.detail
          : typeof responseData === 'string' && responseData
          ? responseData
          : `Error ${response.status}: ${response.statusText}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = { data: responseData, status: response.status };
      throw error;
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error in GET request to ${endpoint}:`, error);
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
    
    // Create the fetch request
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(data),
    });

    // Check content type for better error handling
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData);
      
      const errorMessage = 
        typeof responseData === 'object' && responseData.detail
          ? responseData.detail
          : typeof responseData === 'string' && responseData
          ? responseData
          : `Error ${response.status}: ${response.statusText}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = { data: responseData, status: response.status };
      throw error;
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error in POST request to ${endpoint}:`, error);
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

    // Check content type for better error handling
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData);
      
      const errorMessage = 
        typeof responseData === 'object' && responseData.detail
          ? responseData.detail
          : typeof responseData === 'string' && responseData
          ? responseData
          : `Error ${response.status}: ${response.statusText}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = { data: responseData, status: response.status };
      throw error;
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error in PUT request to ${endpoint}:`, error);
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

    // For DELETE operations that return 204 No Content
    if (response.status === 204) {
      return true;
    }

    // Check content type for better error handling
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData);
      
      const errorMessage = 
        typeof responseData === 'object' && responseData.detail
          ? responseData.detail
          : typeof responseData === 'string' && responseData
          ? responseData
          : `Error ${response.status}: ${response.statusText}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = { data: responseData, status: response.status };
      throw error;
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error in DELETE request to ${endpoint}:`, error);
    throw error;
  }
};
