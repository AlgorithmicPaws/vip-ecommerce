import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  // Datos de usuario simulados - en una aplicación real vendría de una API/backend
  const [userData, setUserData] = useState({
    fullName: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123, Madrid',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prevState => ({
          ...prevState,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Guardar cambios
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Perfil de Usuario</h1>
        
        <div className="profile-header">
          <div className="profile-image-container">
            {isEditing ? (
              <div className="image-upload">
                <label htmlFor="file-input">
                  <div className="profile-image">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Perfil" />
                    ) : (
                      <div className="profile-placeholder">
                        <span>{userData.fullName.charAt(0)}</span>
                      </div>
                    )}
                    <div className="image-overlay">
                      <span>Cambiar</span>
                    </div>
                  </div>
                </label>
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>
            ) : (
              <div className="profile-image">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Perfil" />
                ) : (
                  <div className="profile-placeholder">
                    <span>{userData.fullName.charAt(0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="profile-actions">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="save-btn">
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <span className="info-label">Nombre completo</span>
              <span className="info-value">{userData.fullName}</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Correo electrónico</span>
              <span className="info-value">{userData.email}</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Teléfono</span>
              <span className="info-value">{userData.phone}</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Dirección</span>
              <span className="info-value">{userData.address}</span>
            </div>
          </div>
        )}
        
        <div className="profile-footer">
          <Link to="/dashboard" className="back-link">
            Volver al Dashboard
          </Link>
          <button className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;