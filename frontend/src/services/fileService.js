// src/services/fileService.js
import { authHeader } from './authService';

/**
 * Service for handling file uploads to the backend
 */

// Base API URL
const API_URL = 'http://localhost:8000';

/**
 * Upload a product image to the server
 * 
 * @param {File} file - The image file to upload
 * @param {string} category - Product category
 * @param {string|number} productId - Product ID
 * @returns {Promise<string>} - Path to the uploaded image
 */
export const uploadProductImage = async (file, category = 'uncategorized', productId = 'new') => {
  try {
    // Validate file
    if (!file) {
      return null;
    }
    
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('product_id', productId);
    
    // Send the request
    const response = await fetch(`${API_URL}/files/product-image`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        // Don't set Content-Type for FormData as it'll be set automatically with the proper boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the file path
    return data.file_path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Handle product image upload (for use in components)
 * 
 * @param {Event} event - File input change event
 * @param {string} category - Product category
 * @param {string|number} productId - Product ID
 * @returns {Promise<string>} - Path to the uploaded image
 */
export const handleProductImageUpload = async (event, category, productId = 'new') => {
  if (event?.target?.files?.[0]) {
    return await uploadProductImage(event.target.files[0], category, productId);
  }
  return null;
};

/**
 * Get the complete URL for an image path
 * 
 * @param {string} imagePath - The image path
 * @returns {string} - Complete URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a data URL, return it
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Otherwise, create a full URL
  return `${API_URL}/static${imagePath}`;
};