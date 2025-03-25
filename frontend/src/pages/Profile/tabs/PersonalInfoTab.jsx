import React, { useState } from 'react';
import ProfileImage from '../subcomponents/ProfileImage';
import UserInfoForm from '../subcomponents/UserInfoForm';
import PreferencesForm from '../subcomponents/PreferencesForm';

const PersonalInfoTab = ({ userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Manejar cambios en los inputs de datos personales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar cambios en las preferencias
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        [name]: checked
      }
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (image) => {
    setFormData(prevState => ({
      ...prevState,
      profileImage: image
    }));
  };

  // Guardar cambios de datos personales
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
    <div className="personal-info-tab">
      <div className="section-header">
        <h2>Información Personal</h2>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Editar
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-image-section">
            <ProfileImage 
              profileImage={formData.profileImage} 
              fullName={formData.fullName} 
              size="large"
              editable={true}
              onImageChange={handleImageChange}
            />
          </div>
          
          <UserInfoForm 
            formData={formData}
            onChange={handleChange}
          />
          
          <PreferencesForm 
            preferences={formData.preferences}
            onChange={handlePreferenceChange}
          />
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="info-display">
          <div className="info-section">
            <h3>Datos básicos</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nombre</span>
                <span className="info-value">{userData.fullName}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{userData.email}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Teléfono</span>
                <span className="info-value">{userData.phone}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Fecha de nacimiento</span>
                <span className="info-value">{userData.birthday}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Dirección</span>
                <span className="info-value">{userData.address}</span>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Datos profesionales</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Empresa</span>
                <span className="info-value">{userData.company}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">NIF/CIF</span>
                <span className="info-value">{userData.taxId}</span>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Biografía</h3>
            <p className="bio-text">{userData.bio}</p>
          </div>
          
          <div className="info-section">
            <h3>Preferencias de comunicación</h3>
            <div className="preferences-display">
              <span className={`preference-badge ${userData.preferences.notifications ? 'active' : 'inactive'}`}>
                {userData.preferences.notifications ? '✓' : '✗'} Notificaciones
              </span>
              
              <span className={`preference-badge ${userData.preferences.newsletter ? 'active' : 'inactive'}`}>
                {userData.preferences.newsletter ? '✓' : '✗'} Boletín
              </span>
              
              <span className={`preference-badge ${userData.preferences.smsAlerts ? 'active' : 'inactive'}`}>
                {userData.preferences.smsAlerts ? '✓' : '✗'} Alertas SMS
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;