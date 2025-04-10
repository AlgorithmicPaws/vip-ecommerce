// src/services/productService.js
import * as api from './apiService';

/**
 * Service for handling product-related API operations
 */

/**
 * Get all products for the authenticated seller
 * @param {Object} options - Query options (skip, limit)
 * @returns {Promise} - Response from the API
 */
export const getSellerProducts = async (options = {}) => {
  const { skip = 0, limit = 100 } = options;
  return api.get(`/products/seller/my-products?skip=${skip}&limit=${limit}`);
};

/**
 * Get all categories
 * @returns {Promise} - Response from the API
 */
export const getCategories = async () => {
  return api.get('/categories/');
};

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise} - Response from the API
 */
export const createProduct = async (productData) => {
  // Transform front-end data to API format
  const apiData = {
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price),
    stock_quantity: parseInt(productData.stock),
    category_ids: productData.categoryIds || [], // Will need to be updated when we implement category selection
    images: []
  };
  
  // If there's an image, add it to the images array
  if (productData.image) {
    apiData.images.push({
      image_url: productData.image, // Now this will be a URL instead of base64
      is_primary: true,
      display_order: 0
    });
  }
  
  return api.post('/products/', apiData);
};

/**
 * Update an existing product
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} - Response from the API
 */
export const updateProduct = async (productId, productData) => {
  // Transform front-end data to API format
  const apiData = {
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price),
    stock_quantity: parseInt(productData.stock),
    category_ids: productData.categoryIds || []
  };
  
  return api.put(`/products/${productId}`, apiData);
};

/**
 * Delete a product
 * @param {number} productId - Product ID
 * @returns {Promise} - Response from the API
 */
export const deleteProduct = async (productId) => {
  return api.del(`/products/${productId}`);
};

/**
 * Add an image to a product
 * @param {number} productId - Product ID
 * @param {string} imageUrl - Image URL or base64 data
 * @param {boolean} isPrimary - Whether this is the primary image
 * @returns {Promise} - Response from the API
 */
export const addProductImage = async (productId, imageUrl, isPrimary = true) => {
  const imageData = {
    image_url: imageUrl,
    is_primary: isPrimary,
    display_order: 0
  };
  
  return api.post(`/products/${productId}/images`, imageData);
};

/**
 * Transform API product data to frontend format
 * @param {Object} apiProduct - Product data from API
 * @returns {Object} - Transformed product data for frontend
 */
export const transformApiProduct = (apiProduct) => {
  return {
    id: apiProduct.product_id,
    name: apiProduct.name,
    price: apiProduct.price,
    stock: apiProduct.stock_quantity,
    category: apiProduct.categories.length > 0 ? apiProduct.categories[0].name : '',
    categoryIds: apiProduct.categories.map(cat => cat.category_id),
    description: apiProduct.description || '',
    image: apiProduct.images.length > 0 ? apiProduct.images[0].image_url : null
  };
};

/**
 * Transform API category data to frontend format for select options
 * @param {Array} apiCategories - Categories from API
 * @returns {Array} - Transformed categories for frontend
 */
export const transformApiCategories = (apiCategories) => {
  return apiCategories.map(category => ({
    id: category.category_id,
    name: category.name
  }));
};