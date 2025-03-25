import React from 'react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div 
      className={`address-card ${address.isDefault ? 'default' : ''}`}
    >
      {address.isDefault && (
        <div className="default-badge">Predeterminada</div>
      )}
      
      <h3>{address.title}</h3>
      <div className="address-details">
        <p>{address.fullName}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <p>{address.phone}</p>
      </div>
      
      <div className="address-actions">
        {!address.isDefault && (
          <button 
            className="set-default-btn"
            onClick={onSetDefault}
          >
            Establecer como predeterminada
          </button>
        )}
        <div className="action-buttons">
          <button 
            className="edit-btn-sm"
            onClick={onEdit}
          >
            Editar
          </button>
          <button 
            className="delete-btn-sm"
            onClick={onDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;