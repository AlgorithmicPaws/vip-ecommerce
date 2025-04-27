import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Alert component that shows after a user has been registered as a seller
 * instructing them to log in again to get a fresh token with seller permissions
 */
const TokenRefreshAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    // Check for recently registered seller via localStorage flag
    const justRegisteredAsSeller = localStorage.getItem('just_registered_as_seller');
    
    if (justRegisteredAsSeller === 'true') {
      setShowAlert(true);
      // Clear the flag after showing the alert
      localStorage.removeItem('just_registered_as_seller');
    }
  }, []);
  
  if (!showAlert) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '15px 20px',
      borderRadius: '6px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '350px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        ¡Registro de vendedor exitoso!
      </div>
      <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        Para acceder a todas las funciones de vendedor, necesitas iniciar sesión nuevamente.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link 
          to="/login"
          style={{
            backgroundColor: '#ffc107',
            color: '#212529',
            padding: '5px 10px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Iniciar sesión
        </Link>
        <button
          onClick={() => setShowAlert(false)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TokenRefreshAlert;