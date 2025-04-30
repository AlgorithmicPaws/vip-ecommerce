// src/services/productService.js
import * as api from './apiService';
import { getImageUrl } from './fileService'; // Assuming getImageUrl is correctly implemented here

/**
 * Get all products with optional filtering
 * @param {Object} options - Query options (skip, limit, category_id, search)
 * @returns {Promise<Array>} - Array of transformed products
 */
export const getAllProducts = async (options = {}) => {
  const { skip = 0, limit = 100, categoryId, search } = options;

  let queryParams = `skip=${skip}&limit=${limit}`;
  if (categoryId) queryParams += `&category_id=${categoryId}`;
  // if (search) queryParams += `&search=${encodeURIComponent(search)}`;

  try {
    const products = await api.get(`/products/?${queryParams}`);
    if (!Array.isArray(products)) {
        console.error('API did not return an array for products:', products);
        return [];
    }
    // Transform products *without* seller name initially
    return products.map(product => transformApiProduct(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get all products for the authenticated seller
 * @param {Object} options - Query options (skip, limit)
 * @returns {Promise<Array>} - Array of transformed seller products
 */
export const getSellerProducts = async (options = {}) => {
  const { skip = 0, limit = 100 } = options;
  try {
    const products = await api.get(`/products/seller/my-products?skip=${skip}&limit=${limit}`);
    if (!Array.isArray(products)) {
        console.error('API did not return an array for seller products:', products);
        return [];
    }
    return products.map(product => transformApiProduct(product));
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} - Transformed product object or null
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
 * @returns {Promise<Array>} - Array of categories
 */
export const getCategories = async () => {
  try {
    const categories = await api.get('/categories/');
    if (!Array.isArray(categories)) {
        console.error('API did not return an array for categories:', categories);
        return [];
    }
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data from the form
 * @returns {Promise<Object>} - The created product from the API
 */
export const createProduct = async (productData) => {
  const apiData = {
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price),
    stock_quantity: parseInt(productData.stock),
    category_ids: productData.categoryIds || [],
    images: []
  };
  if (productData.image && typeof productData.image === 'string') {
    apiData.images.push({
      image_url: productData.image,
      is_primary: true,
      display_order: 0
    });
  }
  try {
    return await api.post('/products/', apiData);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product data from the form
 * @returns {Promise<Object>} - The updated product from the API
 */
export const updateProduct = async (productId, productData) => {
  const apiData = {
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price),
    stock_quantity: parseInt(productData.stock),
    category_ids: productData.categoryIds || []
  };
  try {
    return await api.put(`/products/${productId}`, apiData);
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export const deleteProduct = async (productId) => {
  try {
    return await api.del(`/products/${productId}`);
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

/**
 * Add an image to a product
 * @param {number} productId - Product ID
 * @param {string} imageUrl - Image URL or path from fileService
 * @param {boolean} isPrimary - Whether this is the primary image
 * @returns {Promise<Object>} - The added image object from the API
 */
export const addProductImage = async (productId, imageUrl, isPrimary = true) => {
  const imageData = {
    image_url: imageUrl,
    is_primary: isPrimary,
    display_order: 0
  };
  try {
    return await api.post(`/products/${productId}/images`, imageData);
  } catch (error) {
    console.error(`Error adding image to product ${productId}:`, error);
    throw error;
  }
};

/**
 * Transform API product data to frontend format
 * @param {Object} apiProduct - Product data from API
 * @returns {Object|null} - Transformed product data for frontend or null if input is invalid
 */
export const transformApiProduct = (apiProduct) => {
  // Check if product exists and has either product_id or id
  if (!apiProduct || typeof apiProduct !== 'object' || (!apiProduct.product_id && !apiProduct.id)) {
    console.warn('Invalid API product data received in transformApiProduct:', apiProduct);
    return null;
  }

  // Use either product_id or id, depending on which one exists
  const productId = apiProduct.product_id || apiProduct.id;

  let primaryImage = null;
  if (apiProduct.images && Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
    const primary = apiProduct.images.find(img => img && img.is_primary);
    primaryImage = primary?.image_url || apiProduct.images[0]?.image_url || null;
  }

  let price = 0;
  if (apiProduct.price !== null && apiProduct.price !== undefined) {
    const numPrice = parseFloat(apiProduct.price);
    if (!isNaN(numPrice)) price = numPrice;
  }

  let stock = 0;
  if (apiProduct.stock_quantity !== null && apiProduct.stock_quantity !== undefined) {
    const numStock = parseInt(apiProduct.stock_quantity, 10);
    if (!isNaN(numStock)) stock = numStock;
  }

  const categoryName = apiProduct.categories?.[0]?.name || 'Sin categoría';
  const categoryIds = apiProduct.categories?.map(cat => cat?.category_id).filter(id => id != null) || [];
  const imageUrls = apiProduct.images?.map(img => img?.image_url ? getImageUrl(img.image_url) : null).filter(url => url != null) || [];

  return {
    id: productId,
    name: apiProduct.name || 'Nombre no disponible',
    price: price,
    stock: apiProduct.stock_quantity || stock,
    category: categoryName,
    categoryIds: categoryIds,
    description: apiProduct.description || '',
    image: primaryImage ? getImageUrl(primaryImage) : null,
    images: imageUrls,
    sellerId: apiProduct.seller_id || null,
    rating: typeof apiProduct.rating === 'number' ? apiProduct.rating : 4.5,
  };
};

/**
 * Transform API category data
 * @param {Array} apiCategories - Categories from API
 * @returns {Array} - Transformed categories [{ id, name }]
 */
export const transformApiCategories = (apiCategories) => {
  if (!Array.isArray(apiCategories)) {
      console.warn('Invalid categories data received:', apiCategories);
      return [];
  }
  return apiCategories
    .filter(category => category && category.category_id != null && category.name != null)
    .map(category => ({
      id: category.category_id,
      name: category.name
    }));
};

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise<Array>} - Array of featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const products = await getAllProducts({ limit });
    // Note: Seller names won't be included here unless fetched separately
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};