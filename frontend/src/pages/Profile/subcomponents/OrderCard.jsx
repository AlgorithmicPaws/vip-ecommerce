import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ 
  order, 
  isSelected, 
  onViewDetails, 
  onCancelOrder,
  formatDate,
  formatPrice,
  getOrderStatusText,
  getPaymentStatusText
}) => {
  // Helper function to get status color class
  const getStatusColorClass = (status) => {
    const statusColorMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusColorMap[status] || 'status-default';
  };
  
  // Check if order can be cancelled (only pending orders)
  const canBeCancelled = order.order_status === 'pending';

  return (
    <div className={`order-item ${isSelected ? 'selected' : ''}`}>
      <div className="order-id">#{order.order_id}</div>
      <div className="order-date">{formatDate(order.order_date)}</div>
      <div className={`order-status ${getStatusColorClass(order.order_status)}`}>
        {getOrderStatusText(order.order_status)}
        <span className="payment-badge">
          {getPaymentStatusText(order.payment_status)}
        </span>
      </div>
      <div className="order-total">${formatPrice(order.total_amount)}</div>
      <div className="order-actions">
        <button 
          className="view-btn"
          onClick={onViewDetails}
        >
          Ver Detalles
        </button>
        
        {canBeCancelled && (
          <button 
            className="cancel-btn"
            onClick={() => onCancelOrder(order.order_id)}
          >
            Cancelar
          </button>
        )}
        
        {order.tracking_number && (
          <Link 
            to={`https://track.com/${order.tracking_number}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="track-btn"
          >
            Seguir Envío
          </Link>
        )}
        
        {order.payment_status === 'pending' && order.payment_method === 'bank_transfer' && (
          <Link 
            to={`/payment-confirmation/${order.order_id}`} 
            className="payment-btn"
          >
            Confirmar Pago
          </Link>
        )}
        
        <Link 
          to={`/orders/${order.order_id}`} 
          className="detail-link"
        >
          Página Completa
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;