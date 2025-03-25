import React from 'react';

const PaymentMethodCard = ({ paymentMethod, onSetDefault, onDelete }) => {
  return (
    <div 
      className={`payment-card ${paymentMethod.isDefault ? 'default' : ''}`}
    >
      {paymentMethod.isDefault && (
        <div className="default-badge">Predeterminado</div>
      )}
      
      <div className="payment-icon">
        {paymentMethod.type === 'credit_card' ? '💳' : '🔄'}
      </div>
      
      <div className="payment-details">
        <h3>{paymentMethod.name}</h3>
        {paymentMethod.type === 'credit_card' && (
          <p>Expira: {paymentMethod.expiry}</p>
        )}
        {paymentMethod.type === 'paypal' && (
          <p>{paymentMethod.email}</p>
        )}
      </div>
      
      <div className="payment-actions">
        {!paymentMethod.isDefault && (
          <button 
            className="set-default-btn"
            onClick={onSetDefault}
          >
            Establecer como predeterminado
          </button>
        )}
        <div className="action-buttons">
          <button className="edit-btn-sm">Editar</button>
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

export default PaymentMethodCard;