// src/pages/PaymentConfirmation/PaymentReceiptUpload.jsx
import React, { useState, useRef, useEffect } from 'react';

const PaymentReceiptUpload = ({ onFileChange, disabled = false, initialFile = null }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Allowed file types and max size
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSizeMB = 10; // 10MB max size

  // Initialize with an initial file if provided
  useEffect(() => {
    if (initialFile) {
      processFile(initialFile);
    }
  }, [initialFile]);

  // Common file processing logic
  const processFile = (file) => {
    if (!file) return;

    setFileType(file.type);
    setFileName(file.name);
    setFileSize(file.size);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, no preview
      setPreviewUrl(null);
    }

    // Pass the file to parent component
    if (onFileChange) {
      onFileChange(file);
    }
  };

  // Handle file selection from input
  const handleFileSelect = (e) => {
    setError('');
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setError(`Tipo de archivo no válido (${file.type}). Por favor, sube PDF, JPG o PNG.`);
      e.target.value = null;
      return;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`El archivo es demasiado grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). El tamaño máximo es ${maxFileSizeMB}MB.`);
      e.target.value = null;
      return;
    }

    processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    setError('');
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setError(`Tipo de archivo no válido (${file.type}). Por favor, sube PDF, JPG o PNG.`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`El archivo es demasiado grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). El tamaño máximo es ${maxFileSizeMB}MB.`);
      return;
    }

    // If file input has value, reset it
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    processFile(file);
  };

  // Trigger file input when clicking the upload area
  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove the file
  const removeFile = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    setPreviewUrl(null);
    setFileName('');
    setFileType('');
    setFileSize(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onFileChange) {
      onFileChange(null);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="payment-receipt-upload">
      <div 
        ref={dropAreaRef}
        className={`upload-area ${disabled ? 'disabled' : ''} ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''}`}
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
                aria-label="Eliminar archivo"
              >
                &times;
              </button>
            )}
          </div>
        ) : fileName && fileType === 'application/pdf' ? (
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
            <div className="pdf-info">
              <span className="pdf-name">{fileName}</span>
              <span className="pdf-size">{formatFileSize(fileSize)}</span>
            </div>
            {!disabled && (
              <button 
                type="button" 
                className="remove-file" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                aria-label="Eliminar PDF"
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
              {disabled 
                ? 'No hay comprobante cargado'
                : isDragging 
                  ? 'Suelta el archivo aquí'
                  : 'Haz clic o arrastra aquí tu comprobante'
              }
            </p>
            <p className="upload-hint">
              {!disabled && `PDF, JPG, PNG (Máx. ${maxFileSizeMB}MB)`}
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
        aria-label="Subir comprobante de pago"
      />
    </div>
  );
};

export default PaymentReceiptUpload;