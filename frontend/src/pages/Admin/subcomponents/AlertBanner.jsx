// frontend/src/pages/Admin/subcomponents/AlertBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AlertBanner = ({ type = 'info', message, link, onDismiss }) => {
  // Definir icono según el tipo de alerta
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`alert-banner ${type}`}>
      <div className="alert-icon">{getIcon()}</div>
      
      <div className="alert-content">
        <p className="alert-message">{message}</p>
      </div>
      
      <div className="alert-actions">
        {link && (
          <Link to={link} className="alert-link">
            Ver detalles
          </Link>
        )}
        
        <button 
          className="dismiss-btn" 
          onClick={onDismiss}
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;