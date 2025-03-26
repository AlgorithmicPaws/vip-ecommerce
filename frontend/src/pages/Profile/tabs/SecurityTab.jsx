import React, { useState } from 'react';

const SecurityTab = ({ userData, setUserData }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Actualizar contraseña
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    
    // Aquí iría la validación de contraseña actual y nueva
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }
    
    // En una app real, aquí iría la llamada a la API para cambiar la contraseña
    alert('Contraseña actualizada correctamente');
    
    // Limpiar formulario
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Cambiar estado de autenticación de dos factores
  const handleToggleTwoFactor = () => {
    setUserData(prevUserData => ({
      ...prevUserData,
      preferences: {
        ...prevUserData.preferences,
        twoFactorAuth: !prevUserData.preferences.twoFactorAuth
      }
    }));
  };

  return (
    <div className="security-tab">
      <div className="section-header">
        <h2>Seguridad de la Cuenta</h2>
      </div>
      
      <div className="security-section">
        <h3>Cambiar Contraseña</h3>
        <form className="security-form" onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label>Contraseña actual</label>
            <input 
              type="password" 
              name="currentPassword" 
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input 
              type="password" 
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirmar nueva contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <button type="submit" className="save-btn">
            Actualizar Contraseña
          </button>
        </form>
      </div>
      
      <div className="security-section">
        <h3>Autenticación de Dos Factores</h3>
        <div className="two-factor-toggle">
          <span>Estado: {userData.preferences.twoFactorAuth ? 'Activado' : 'Desactivado'}</span>
          <button 
            className={`toggle-btn ${userData.preferences.twoFactorAuth ? 'active' : ''}`}
            onClick={handleToggleTwoFactor}
          >
            {userData.preferences.twoFactorAuth ? 'Desactivar' : 'Activar'}
          </button>
        </div>
        <p className="info-text">
          La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta 
          solicitando un código adicional además de tu contraseña cuando inicies sesión.
        </p>
      </div>
      
      <div className="security-section">
        <h3>Sesiones Activas</h3>
        <div className="session-card">
          <div className="session-icon">💻</div>
          <div className="session-details">
            <h4>Este Dispositivo</h4>
            <p>Madrid, España</p>
            <p>Última actividad: Hoy, 15:45</p>
          </div>
          <button className="session-btn current">Dispositivo Actual</button>
        </div>
        
        <div className="session-card">
          <div className="session-icon">📱</div>
          <div className="session-details">
            <h4>iPhone de Juan</h4>
            <p>Madrid, España</p>
            <p>Última actividad: Ayer, 19:20</p>
          </div>
          <button className="session-btn logout">Cerrar Sesión</button>
        </div>
      </div>
      
      <div className="security-section danger-zone">
        <h3>Zona Peligrosa</h3>
        <div className="danger-actions">
          <div className="danger-action">
            <div>
              <h4>Descargar Mis Datos</h4>
              <p>Obtén una copia de todos tus datos personales y actividad.</p>
            </div>
            <button className="download-btn">Descargar</button>
          </div>
          
          <div className="danger-action">
            <div>
              <h4>Eliminar Cuenta</h4>
              <p>Eliminar permanentemente tu cuenta y todos tus datos.</p>
            </div>
            <button className="delete-account-btn">Eliminar Cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;