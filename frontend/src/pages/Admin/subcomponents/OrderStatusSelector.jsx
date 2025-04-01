// frontend/src/pages/Admin/subcomponents/OrderStatusSelector.jsx
import React from 'react';

const OrderStatusSelector = ({ currentStatus, onStatusChange }) => {
  // Opciones de estado con color y nombre para mostrar
  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: '#f0ad4e' },
    { value: 'processing', label: 'En proceso', color: '#5bc0de' },
    { value: 'completed', label: 'Completado', color: '#5cb85c' },
    { value: 'cancelled', label: 'Cancelado', color: '#d9534f' },
    { value: 'refunded', label: 'Reembolsado', color: '#777777' }
  ];
  
  // Encontrar el estado actual para mostrar su etiqueta y color
  const currentStatusOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0];
  
  return (
    <div className="status-selector">
      <div 
        className="status-display"
        style={{ backgroundColor: currentStatusOption.color }}
      >
        {currentStatusOption.label}
      </div>
      
      <div className="status-dropdown">
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="status-select"
        >
          {statusOptions.map(option => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderStatusSelector;