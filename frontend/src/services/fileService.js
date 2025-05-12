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
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://vipscm.shop/api';
  
  // Parse the API URL to extract base parts
  let apiBase;
  try {
    // Create URL object to properly parse the API URL
    const apiUrl = new URL(API_URL);
    apiBase = `${apiUrl.protocol}//${apiUrl.host}`;
  } catch (error) {
    console.error('Error parsing API URL:', error);
    apiBase = API_URL; // Fallback to original if parsing fails
  }
  
  let finalUrl;
  
  // Clean up the image path - remove any API URL that might be in it
  let cleanPath = imagePath;
  if (cleanPath.includes('vipscm.shop') || cleanPath.includes('/api/')) {
    // Extract just the path part after /api/ if it exists
    const pathMatch = cleanPath.match(/\/api\/(.*)/);
    if (pathMatch && pathMatch[1]) {
      cleanPath = pathMatch[1];
    } else {
      // Try to extract just the path after the domain
      const urlParts = cleanPath.split('/');
      if (urlParts.length > 2) {
        // Skip protocol and domain parts
        cleanPath = '/' + urlParts.slice(3).join('/');
      }
    }
  }
  
  // Normalize the path
  cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // Now construct the final URL properly
  if (cleanPath.includes('/static/')) {
    // If path already has /static, don't add it again
    // But still make sure it has the correct domain
    finalUrl = `${apiBase}${cleanPath}`;
  } else if (cleanPath.includes('/images/products/')) {
    // Path has /images/products but not /static
    finalUrl = `${apiBase}/static${cleanPath}`;
  } else {
    // Add /static to the path
    finalUrl = `${apiBase}/static${cleanPath}`;
  }
  
  return finalUrl;
};
