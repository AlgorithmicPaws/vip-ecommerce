// src/services/productService.js
import * as api from './apiService';
import { getImageUrl } from './fileService';

/**
 * Service for handling product-related API operations
 */

/**
 * Get all products with optional filtering
 * @param {Object} options - Query options (skip, limit, category_id, search)
 * @returns {Promise} - Response from the API
 */
export const getAllProducts = async (options = {}) => {
  const { skip = 0, limit = 100, categoryId, search } = options;
  
  let queryParams = `skip=${skip}&limit=${limit}`;
  if (categoryId) queryParams += `&category_id=${categoryId}`;
  
  try {
    const products = await api.get(`/products/?${queryParams}`);
    return products.map(product => transformApiProduct(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

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
 * Get a single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise} - Response from the API
 */
export const getProductById = async (productId) => {
  try {
    const product = await api.get(`/products/${productId}`);
    return transformApiProduct(product);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
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
    category_ids: productData.categoryIds || [],
    images: []
  };
  
  // If there's an image, add it to the images array
  if (productData.image) {
    apiData.images.push({
      image_url: productData.image,
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
  // Get the primary image or the first image if no primary is set
  let primaryImage = null;
  if (apiProduct.images && apiProduct.images.length > 0) {
    const primary = apiProduct.images.find(img => img.is_primary);
    primaryImage = primary ? primary.image_url : apiProduct.images[0].image_url;
  }

  return {
    id: apiProduct.product_id,
    name: apiProduct.name,
    price: apiProduct.price,
    stock: apiProduct.stock_quantity,
    category: apiProduct.categories.length > 0 ? apiProduct.categories[0].name : '',
    categoryIds: apiProduct.categories.map(cat => cat.category_id),
    description: apiProduct.description || '',
    image: primaryImage ? getImageUrl(primaryImage) : null,
    images: apiProduct.images.map(img => getImageUrl(img.image_url)),
    rating: 4.5, // Default rating if not provided by API
    seller: apiProduct.seller ? apiProduct.seller.business_name : 'Unknown Seller',
    sellerId: apiProduct.seller_id
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

/**
 * Get featured products (you might want to add a param in the backend for this)
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} - Response with featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  try {
    // In a real implementation, you might have a specific endpoint or parameter for featured products
    // For now, we'll just get the first 'limit' products
    const products = await getAllProducts({ limit });
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};