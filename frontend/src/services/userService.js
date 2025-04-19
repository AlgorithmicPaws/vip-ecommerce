// src/services/userService.js
import * as api from './apiService';

/**
 * Service for handling user-related API operations
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from the API
 */
export const registerUser = async (userData) => {
  return api.post('/users/', userData);
};

/**
 * Get user profile
 * @returns {Promise} - Response from the API with user profile
 */
export const getUserProfile = async () => {
  return api.get('/users/me');
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Response from the API
 */
export const updateUserProfile = async (userData) => {
  return api.put('/users/me', userData);
};

/**
 * Update user password
 * @param {Object} passwordData - Password data with current_password and new_password
 * @returns {Promise} - Response from the API
 */
export const updatePassword = async (passwordData) => {
  return api.put('/users/me/password', passwordData);
};

/**
 * Delete user account
 * @returns {Promise} - Response from the API
 */
export const deleteUserAccount = async () => {
  return api.del('/users/me');
};

/**
 * Register as a seller
 * @param {Object} sellerData - Seller registration data
 * @returns {Promise} - Response from the API
 */
export const registerAsSeller = async (sellerData) => {
  return api.post('/sellers/', sellerData);
};

/**
 * Get seller profile
 * @returns {Promise} - Response from the API with seller profile
 */
export const getSellerProfile = async () => {
  return api.get('/sellers/me');
};

/**
 * Update seller profile
 * @param {Object} sellerData - Updated seller data
 * @returns {Promise} - Response from the API
 */
export const updateSellerProfile = async (sellerData) => {
  return api.put('/sellers/me', sellerData);
};