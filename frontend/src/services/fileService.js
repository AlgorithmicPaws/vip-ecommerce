// src/services/fileService.js
import { authHeader } from './authService';

/**
 * Service for handling file uploads to the backend
 */

// Base API URL
const API_URL = import.meta.env.VITE_API_URL;
// Add warning if not set
if (!API_URL) {
  console.error('VITE_API_URL is not set! Configure your environment variables.');
}
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
    console.log("Auth headers for upload:", headers); // Debug log
    
    // Send the request
    const response = await fetch(`${API_URL}/files/product-image`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    // Log status for debugging
    console.log("File upload response status:", response.status);
    
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
/**
 * Get the complete URL for an image path
 * Handles Docker container paths correctly
 * 
 * @param {string} imagePath - The image path
 * @returns {string} - Complete URL
 */
export const getImageUrl = (imagePath) => {
  // For debugging
  console.log('Processing image path:', imagePath);
  
  if (!imagePath) {
    console.log('No image path provided');
    return null;
  }
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    console.log('Image already has full URL:', imagePath);
    return imagePath;
  }
  
  // If it's a data URL, return it
  if (imagePath.startsWith('data:')) {
    console.log('Image is a data URL');
    return imagePath;
  }
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://vipscm.shop/api';
  
  // Parse the API URL to extract base parts
  let apiBase;
  try {
    // Create URL object to properly parse the API URL
    const apiUrl = new URL(API_URL);
    apiBase = `${apiUrl.protocol}//${apiUrl.host}`;
  } catch (error) {
    console.error('Error parsing API URL:', error);
    apiBase = API_URL.replace(/\/api$/, ''); // Remove /api if it exists
  }
  
  // Handle Docker-specific path structure
  let finalUrl;
  
  // Normalize the path - remove any leading /api/ or duplicate /static/
  let cleanPath = imagePath;
  
  // Remove any API path prefix
  cleanPath = cleanPath.replace(/^.*?\/api\//, '/');
  
  // Ensure path starts with /
  cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // Check if the path includes the category/product_id structure
  if (cleanPath.includes('/images/products/')) {
    // Make sure it has /static/ prefix for the backend
    if (!cleanPath.includes('/static/')) {
      cleanPath = `/static${cleanPath}`;
    }
    
    // Construct the final URL
    finalUrl = `${apiBase}${cleanPath}`;
  } else {
    // For other cases, add /static if needed
    finalUrl = `${apiBase}${cleanPath.includes('/static/') ? cleanPath : `/static${cleanPath}`}`;
  }
  
  console.log('Final image URL:', finalUrl);
  return finalUrl;
}
