import React from 'react';

const LoadingIndicator = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingIndicator;