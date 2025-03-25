import React from 'react';

const OrderCard = ({ order, isSelected, onViewDetails }) => {
  return (
    <div 
      className={`order-item ${isSelected ? 'selected' : ''}`}
    >
      <div className="order-id">{order.id}</div>
      <div className="order-date">{order.date}</div>
      <div className={`order-status status-${order.status.toLowerCase()}`}>
        {order.status}
      </div>
      <div className="order-total">${order.total.toFixed(2)}</div>
      <div className="order-actions">
        <button 
          className="view-btn"
          onClick={onViewDetails}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default OrderCard;