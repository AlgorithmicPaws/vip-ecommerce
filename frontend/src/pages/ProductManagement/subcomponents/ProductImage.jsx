import React, { useRef } from 'react';

const ProductImage = ({ image, onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearImage = (e) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div className="image-preview" onClick={triggerFileInput}>
        {image ? (
          <div className="image-preview-container">
            <img src={image} alt="Vista previa" />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={clearImage}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <span>Haz clic para subir imagen</span>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProductImage;