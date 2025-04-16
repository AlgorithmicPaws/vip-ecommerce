import React, { useRef, useState, useEffect } from 'react';
import { handleProductImageUpload, getImageUrl } from '../../../services/fileService';

const ProductImage = ({ image, onChange, category, productId = 'new', disabled = false }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displaySrc, setDisplaySrc] = useState(null);
  
  // Update display source when image path changes
  useEffect(() => {
    if (image) {
      setDisplaySrc(getImageUrl(image));
    } else {
      setDisplaySrc(null);
    }
  }, [image]);

  const handleFileChange = async (e) => {
    if (disabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload the image to the server
      const imagePath = await handleProductImageUpload(e, category, productId);
      if (imagePath) {
        // Return the path to the parent component
        onChange(imagePath);
        
        // Update display source for preview
        setDisplaySrc(getImageUrl(imagePath));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Error processing image');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const clearImage = (e) => {
    e.stopPropagation();
    if (disabled) return;
    
    onChange(null);
    setDisplaySrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className="image-upload-container">
      <div 
        className="image-preview" 
        onClick={triggerFileInput}
        style={{ 
          position: 'relative', 
          height: '200px', 
          border: '1px dashed #ccc',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? (
          <div className="loading-spinner" style={{ margin: 'auto' }}>Loading...</div>
        ) : displaySrc ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img 
              src={displaySrc} 
              alt="Product preview" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
            {!disabled && (
              <button 
                type="button" 
                onClick={clearImage}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.7)',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {disabled ? 'No image available' : 'Click to upload image'}
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
          {error}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
        Accepted formats: JPG, PNG, GIF. Max size: 5MB
      </div>
    </div>
  );
};

export default ProductImage;