// src/services/orderService.js
import * as api from './apiService';

/**
 * Service for handling order-related API operations
 */

/**
 * Create a new order in the database
 * @param {Object} orderData - Order data including items, shipping details, etc.
 * @returns {Promise} - Response from the API with created order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
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
    const response = await api.get(`/orders/my-orders?skip=${skip}&limit=${limit}`);
    return response;
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
    const response = await api.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Generate a PDF invoice for an order and send it by email
 * @param {string} orderId - Order ID
 * @param {string} email - Email to send the PDF to
 * @returns {Promise} - Response from the API
 */
export const generateAndSendInvoice = async (orderId, email) => {
  try {
    const response = await api.post(`/orders/${orderId}/send-invoice`, { email });
    return response;
  } catch (error) {
    console.error(`Error generating invoice for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Transform order data for submission to API
 * @param {Object} cartData - Shopping cart data
 * @param {Object} userData - User data including shipping address
 * @returns {Object} - Formatted order data for API
 */
export const prepareOrderData = (cartData, userData) => {
  return {
    items: cartData.items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_per_unit: item.price,
      total_price: item.price * item.quantity
    })),
    shipping_address: {
      street: userData.street,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zipCode,
      country: userData.country
    },
    billing_address: userData.sameAsShipping ? {
      street: userData.street,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zipCode,
      country: userData.country
    } : {
      street: userData.billingStreet,
      city: userData.billingCity,
      state: userData.billingState,
      zip_code: userData.billingZipCode,
      country: userData.billingCountry
    },
    payment_method: 'bank_transfer', // Always set to bank transfer
    subtotal: cartData.subtotal,
    discount: cartData.discount || 0,
    shipping_cost: cartData.shippingCost,
    total_amount: cartData.total,
    notes: userData.orderNotes || '',
    // Extra fields for bank transfer
    payment_status: 'pending',
    bank_transfer_info: {
      bank_name: 'Bancolombia',
      account_holder: 'ConstructMarket Colombia S.A.S',
      account_number: '69812345678',
      account_type: 'Corriente'
    }
  };
};

/**
 * Update order payment status (for bank transfer confirmations)
 * @param {string} orderId - Order ID
 * @param {string} status - New payment status ('pending', 'paid', 'cancelled')
 * @param {Object} paymentDetails - Optional payment details (receipt number, date, etc.)
 * @returns {Promise} - Response from the API
 */
export const updateOrderPaymentStatus = async (orderId, status, paymentDetails = {}) => {
  try {
    const response = await api.put(`/orders/${orderId}/payment-status`, { 
      status, 
      payment_details: paymentDetails 
    });
    return response;
  } catch (error) {
    console.error(`Error updating payment status for order ${orderId}:`, error);
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
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Upload payment receipt for a bank transfer order
 * @param {string} orderId - Order ID
 * @param {File} receiptFile - Payment receipt file
 * @param {Object} paymentDetails - Additional payment details
 * @returns {Promise} - Response from the API
 */
export const uploadPaymentReceipt = async (orderId, receiptFile, paymentDetails = {}) => {
  try {
    const formData = new FormData();
    formData.append('receipt', receiptFile);
    formData.append('payment_details', JSON.stringify(paymentDetails));
    
    const response = await api.post(`/orders/${orderId}/payment-receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    console.error(`Error uploading payment receipt for order ${orderId}:`, error);
    throw error;
  }
};