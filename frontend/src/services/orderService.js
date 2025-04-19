// src/services/orderService.js
import * as api from './apiService';

/**
 * Create a new order in the database
 * @param {Object} orderData - Order data including items, shipping details, etc.
 * @returns {Promise} - Response from the API with created order
 */
export const createOrder = async (orderData) => {
  try {
    // Add detailed logging for troubleshooting
    console.log('Sending order data to API:', JSON.stringify(orderData, null, 2));
    
    const response = await api.post('/orders/', orderData);
    console.log('Order created successfully:', response);
    
    return response;
  } catch (error) {
    // Log the detailed error for debugging
    console.error('Error creating order:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get user's order history
 * @param {Object} options - Query options (skip, limit)
 * @returns {Promise} - Response from the API with order history
 */
export const getOrderHistory = async (options = {}) => {
  const { skip = 0, limit = 20 } = options;
  try {
    return await api.get(`/orders/my-orders?skip=${skip}&limit=${limit}`);
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

/**
 * Get order details by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} - Response from the API with order details
 */
export const getOrderById = async (orderId) => {
  try {
    return await api.get(`/orders/${orderId}`);
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @param {string} reason - Reason for cancellation
 * @returns {Promise} - Response from the API
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    return await api.put(`/orders/${orderId}/cancel`, { reason });
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder
};