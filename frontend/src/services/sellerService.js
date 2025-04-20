// src/services/sellerService.js
import * as api from './apiService';

/**
 * Get seller profile for the authenticated user
 * @returns {Promise} - Response from the API with seller profile
 */
export const getSellerProfile = async () => {
  try {
    return await api.get('/sellers/me');
  } catch (error) {
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
    return await api.post('/sellers/', sellerData);
  } catch (error) {
    console.error('Error registering as seller:', error);
    throw error;
  }
};