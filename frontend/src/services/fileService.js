// src/services/fileService.js
import { authHeader } from './authService';

/**
 * Service for handling file uploads to the backend
 */

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    
    // Get fresh auth headers - important to get the latest token
    const headers = authHeader();
    
    // Send the request
    const response = await fetch(`${API_URL}/files/product-image`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
  
    
    if (!response.ok) {
      let errorDetail;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || `Upload failed with status ${response.status}`;
      } catch (e) {
        errorDetail = `Upload failed with status ${response.status}`;
      }
      
      console.error("File upload error:", errorDetail);
      throw new Error(errorDetail);
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
  
  // API URL
  
  let finalUrl;
  
  // Check if the path already has /static in it
  if (imagePath.includes('/static/')) {
    // Path already has /static, so don't add it again
    if (imagePath.startsWith('/')) {
      finalUrl = `${API_URL}${imagePath}`;
    } else {
      finalUrl = `${API_URL}/${imagePath}`;
    }
  } else if (imagePath.includes('/images/products/')) {
    // Path has /images/products but not /static
    if (imagePath.startsWith('/')) {
      finalUrl = `${API_URL}/static${imagePath}`;
    } else {
      finalUrl = `${API_URL}/static/${imagePath}`;
    }
  } else {
    // Ensure the path has a leading slash
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    // Return the complete URL with /static prefix
    finalUrl = `${API_URL}/static${normalizedPath}`;
  }

  
  // Verify the image exists by making a HEAD request
  fetch(finalUrl, { method: 'HEAD' })
    .then(response => {
      if (!response.ok) {
        console.warn(`Image at ${finalUrl} may not exist: ${response.status}`);
      }
    })
    .catch(error => {
      console.warn(`Error checking image at ${finalUrl}:`, error);
    });
  
  return finalUrl;
};