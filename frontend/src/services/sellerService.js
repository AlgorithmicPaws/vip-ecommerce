// src/services/sellerService.js
import * as api from './apiService';

/**
 * Get seller profile for the authenticated user
 * @returns {Promise} - Response from the API with seller profile
 */
export const getSellerProfile = async () => {
  try {
    // Calls GET /sellers/me
    return await api.get('/sellers/me');
  } catch (error) {
    // Log error and re-throw for component handling
    console.error('Error fetching seller profile:', error);
    throw error;
  }
};

/**
 * Register as a seller (for existing users)
 * @param {Object} sellerData - Seller registration data
 * @returns {Promise} - Response from the API
 */
export const registerAsSeller = async (sellerData) => {
  try {
    // Calls POST /sellers/
    return await api.post('/sellers/', sellerData);
  } catch (error) {
    // Log error and re-throw
    console.error('Error registering as seller:', error);
    throw error;
  }
};

/**
 * Get seller details by ID (public endpoint)
 * Fetches data from the new GET /sellers/{sellerId} endpoint.
 * @param {string|number} sellerId - The ID of the seller to fetch
 * @returns {Promise<Object|null>} - Seller details object or null if not found/error
 */
export const getSellerById = async (sellerId) => {
  // Avoid unnecessary API call if sellerId is missing or invalid
  if (!sellerId) {
    console.warn('getSellerById called with invalid ID:', sellerId);
    return null;
  }
  try {
    // Call the new public endpoint GET /sellers/{sellerId}
    const sellerData = await api.get(`/sellers/${sellerId}`);
    return sellerData; // Returns the seller object { seller_id, user_id, business_name, ... }
  } catch (error) {
    // Log the specific error but return null to prevent breaking the entire product list load
    // The component logic should handle cases where seller details are missing.
    console.error(`Error fetching seller details for ID ${sellerId}:`, error);
    return null;
  }
};

/**
 * Get a list of all sellers (for filtering)
 * Fetches data from the new GET /sellers/ endpoint.
 * @param {Object} options - Query options (skip, limit)
 * @returns {Promise<Array>} - List of sellers [{ seller_id, business_name }]
 */
export const getAllSellers = async (options = {}) => {
  // Default to fetching a reasonable number for a filter, adjust as needed
  const { skip = 0, limit = 500 } = options;
  try {
    // Call the new public endpoint GET /sellers/?skip=...&limit=...
    const sellers = await api.get(`/sellers/?skip=${skip}&limit=${limit}`);
    // Ensure the response is an array before returning
    return Array.isArray(sellers) ? sellers : [];
  } catch (error) {
    // Log error and return an empty array to avoid breaking the filter UI
    console.error('Error fetching all sellers:', error);
    return [];
  }
};
