import React, { useRef, useState } from 'react';

const FileUploadField = ({ 
  label, 
  name, 
  onChange, 
  error, 
  accept = '*', 
  description = '',
  maxSize = 5 // en MB
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño del archivo
      if (file.size > maxSize * 1024 * 1024) {
        setFileError(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
        setFileName('');
        return;
      }
      
      setFileName(file.name);
      setFileError('');
      onChange(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const clearFile = (e) => {
    e.stopPropagation();
    setFileName('');
    setFileError('');
    onChange(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="form-group file-upload-group">
      <label className="field-label">{label}</label>
      
      <div className={`file-upload-field ${error || fileError ? 'error' : ''} ${fileName ? 'has-file' : ''}`}>
        <input
          type="file"
          ref={fileInputRef}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <div className="file-upload-content" onClick={triggerFileInput}>
          <div className="upload-icon">
            {fileName ? '📄' : '📁'}
          </div>
          <div className="upload-text">
            {fileName ? 
              <span className="file-name">{fileName}</span> : 
              <span className="upload-placeholder">Selecciona una imagen o un PDF</span>
            }
            {!fileName && <span className="upload-description">{description}</span>}
          </div>
          {fileName && (
            <button 
              type="button" 
              className="clear-file-btn"
              onClick={clearFile}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {(error || fileError) && (
        <p className="field-error">{error || fileError}</p>
      )}
    </div>
  );
};

export default FileUploadField;