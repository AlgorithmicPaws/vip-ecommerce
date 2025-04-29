// src/pages/PaymentConfirmation/PaymentReceiptUpload.jsx
import React, { useState, useRef } from 'react';

const PaymentReceiptUpload = ({ onFileChange, disabled = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSizeMB = 10; // 10MB max size

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Por favor, sube PDF, JPG o PNG.');
      e.target.value = null;
      return;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`El archivo es demasiado grande. El tamaño máximo es ${maxFileSizeMB}MB.`);
      e.target.value = null;
      return;
    }

    // Create preview URL for images (not for PDFs)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF files, just show an icon/placeholder
      setPreviewUrl(null);
    }

    setFileName(file.name);
    
    // Pass the file to parent component
    if (onFileChange) {
      onFileChange(file);
    }
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setPreviewUrl(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div className="payment-receipt-upload">
      <div 
        className={`upload-area ${disabled ? 'disabled' : ''}`} 
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="preview-container">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="file-preview" 
            />
            {!disabled && (
              <button 
                type="button" 
                className="remove-file" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                &times;
              </button>
            )}
          </div>
        ) : fileName ? (
          <div className="pdf-preview">
            <div className="pdf-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span className="pdf-name">{fileName}</span>
            {!disabled && (
              <button 
                type="button" 
                className="remove-file" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                &times;
              </button>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p className="upload-text">
              Haz clic para subir tu comprobante de pago <br/>
              <span className="upload-hint">(PDF, JPG, PNG - Máx. {maxFileSizeMB}MB)</span>
            </p>
          </div>
        )}
      </div>
      
      {error && <div className="upload-error">{error}</div>}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
        className="file-input"
        disabled={disabled}
      />
    </div>
  );
};

export default PaymentReceiptUpload;