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
 * Update an order's status
 * @param {string} orderId - Order ID
 * @param {string} status - New order status
 * @returns {Promise} - Response from the API
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    return await api.put(`/orders/${orderId}`, { order_status: status });
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update an order item's quantity
 * @param {string} orderId - Order ID
 * @param {string} itemId - Order item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} - Response from the API
 */
export const updateOrderItem = async (orderId, itemId, quantity) => {
  try {
    return await api.put(`/orders/${orderId}/items/${itemId}`, { quantity });
  } catch (error) {
    console.error(`Error updating order item ${itemId}:`, error);
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
 * Update payment status for an order
 * @param {string} orderId - Order ID
 * @param {string} status - New payment status
 * @param {Object} paymentDetails - Additional payment details
 * @returns {Promise} - Response from the API
 */
export const updatePaymentStatus = async (orderId, status, paymentDetails = {}) => {
  try {
    return await api.put(`/orders/${orderId}/payment-status`, { 
      status, 
      payment_details: paymentDetails 
    });
  } catch (error) {
    console.error(`Error updating payment status for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Upload payment receipt information
 * @param {string} orderId - Order ID
 * @param {Object} receiptInfo - Payment receipt information
 * @returns {Promise} - Response from the API
 */
export const uploadPaymentReceipt = async (orderId, receiptInfo) => {
  try {
    return await api.post(`/orders/${orderId}/payment-receipt`, receiptInfo);
  } catch (error) {
    console.error(`Error uploading payment receipt for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Transform frontend cart data to API order format
 * @param {Object} cartData - Shopping cart data
 * @param {Object} userData - User data including shipping address
 * @returns {Object} - Formatted order data for API
 */
export const prepareOrderData = (cartData, userData) => {
  // Create shipping address object
  const shippingAddress = {
    street: userData.street,
    city: userData.city,
    state: userData.state,
    zip_code: userData.zipCode,
    country: userData.country
  };

  // Create billing address if different from shipping
  let billingAddress = null;
  if (!userData.sameAsShipping) {
    billingAddress = {
      street: userData.billingStreet,
      city: userData.billingCity,
      state: userData.billingState,
      zip_code: userData.billingZipCode,
      country: userData.billingCountry
    };
  }

  // Format order items
  const items = cartData.items.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
    price_per_unit: parseFloat(item.price)
  }));

  // Create bank transfer information
  const bankTransferInfo = {
    bank_name: 'Bancolombia',
    account_holder: 'ConstructMarket Colombia S.A.S',
    account_number: '69812345678',
    account_type: 'Corriente',
    reference: `Pedido-${Date.now()}`
  };

  // Prepare complete order data
  return {
    items: items,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    payment_method: 'bank_transfer',
    payment_status: 'pending',
    bank_transfer_info: bankTransferInfo,
    notes: userData.orderNotes || ''
  };
};