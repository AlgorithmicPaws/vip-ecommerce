import React, { useRef } from 'react';

const ProfileImage = ({ profileImage, fullName, size = 'medium', editable = false, onImageChange }) => {
  const fileInputRef = useRef(null);
  
  // Determinar la clase de tamaño
  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'profile-image-small';
      case 'large': return 'profile-image-large';
      default: return 'profile-image-medium';
    }
  };
  
  // Manejar la selección de archivos
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0] && onImageChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Abrir el selector de archivos
  const triggerFileInput = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`profile-image-container ${getSizeClass()}`}>
      {profileImage ? (
        <img 
          src={profileImage} 
          alt={fullName || 'Perfil'}
          className={`profile-image ${editable ? 'editable' : ''}`}
          onClick={triggerFileInput}
        />
      ) : (
        <div 
          className={`profile-placeholder ${editable ? 'editable' : ''}`}
          onClick={triggerFileInput}
        >
          <span>{fullName ? fullName.charAt(0) : '?'}</span>
        </div>
      )}
      
      {editable && (
        <>
          <div className="image-overlay" onClick={triggerFileInput}>
            <span>Cambiar</span>
          </div>
          <input 
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default ProfileImage;