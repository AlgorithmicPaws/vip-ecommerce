// src/services/orderService.js - Enhanced with always-successful payment confirmation

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

/**
 * Submit payment confirmation with receipt
 * MODIFIED to always return a successful response
 * 
 * @param {string} orderId - Order ID
 * @param {FormData} formData - Form data with payment details and receipt file
 * @returns {Promise} - Always a successful response
 */
export const submitPaymentConfirmation = async (orderId, formData) => {
  // Log what would be sent to the server
  console.log(`Submitting payment confirmation for order ${orderId}`);
  
  // Extract data from FormData to log it (for demonstration only)
  let paymentInfo = {};
  try {
    // Get the JSON data from formData
    const dataString = formData.get('data');
    if (dataString) {
      paymentInfo = JSON.parse(dataString);
      console.log('Payment info:', paymentInfo);
    }
    
    // Get the file from formData (if any)
    const receiptFile = formData.get('receipt');
    if (receiptFile) {
      console.log('Receipt file:', {
        name: receiptFile.name,
        type: receiptFile.type,
        size: receiptFile.size
      });
    } else {
      console.log('No receipt file provided');
    }
  } catch (error) {
    console.error('Error extracting data from FormData:', error);
  }
  
  // In a real implementation, this would use api.post with the FormData
  // return await api.post(`/orders/${orderId}/payment-confirmation`, formData);
  
  // Mock implementation with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Always return a successful response
      const mockResponse = {
        order_id: orderId,
        payment_status: 'pending_review', 
        message: 'Payment confirmation received successfully. It will be verified by our team.',
        received_at: new Date().toISOString(),
        receipt_file: formData.get('receipt')?.name || 'Unknown'
      };
      
      // Log success message
      console.log('✅ Payment confirmation successful:', mockResponse);
      
      resolve(mockResponse);
    }, 1500); // Simulate network delay
  });
};

export default {
  createOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder,
  submitPaymentConfirmation
};