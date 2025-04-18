import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderItemsList from './OrderItemsList';
import OrderDetails from './OrderDetails';

const OrderCard = ({ 
  order, 
  formatDate, 
  formatPrice, 
  getOrderStatusText, 
  getPaymentStatusText,
  onCancelOrder 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
  
  // Helper function to get payment status color class
  const getPaymentStatusColorClass = (status) => {
    const statusColorMap = {
      'pending': 'payment-pending',
      'paid': 'payment-paid',
      'refunded': 'payment-refunded',
      'cancelled': 'payment-cancelled'
    };
    return statusColorMap[status] || 'payment-default';
  };
  
  // Check if order can be cancelled (only pending orders)
  const canBeCancelled = order.order_status === 'pending';
  
  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-header-left">
          <h2>Pedido #{order.order_id}</h2>
          <p className="order-date">Fecha: {formatDate(order.order_date)}</p>
        </div>
        <div className="order-header-right">
          <div className={`order-status ${getStatusColorClass(order.order_status)}`}>
            {getOrderStatusText(order.order_status)}
          </div>
          <div className={`payment-status ${getPaymentStatusColorClass(order.payment_status)}`}>
            Pago: {getPaymentStatusText(order.payment_status)}
          </div>
        </div>
      </div>
      
      <div className="order-summary">
        <p className="items-count">
          {order.order_items.length} {order.order_items.length === 1 ? 'producto' : 'productos'}
        </p>
        <p className="order-total">
          Total: ${formatPrice(order.total_amount)}
        </p>
      </div>
      
      <OrderItemsList items={order.order_items} formatPrice={formatPrice} />
      
      {showDetails && (
        <OrderDetails 
          order={order} 
          formatDate={formatDate} 
          formatPrice={formatPrice}
          getOrderStatusText={getOrderStatusText}
          getPaymentStatusText={getPaymentStatusText}
        />
      )}
      
      <div className="order-actions">
        <button 
          className="details-toggle-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
        
        {order.tracking_number && order.order_status !== 'cancelled' && (
          <a 
            href={`https://track.com/${order.tracking_number}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="track-order-btn"
          >
            Seguir envío
          </a>
        )}
        
        {canBeCancelled && (
          <button 
            className="cancel-order-btn"
            onClick={() => onCancelOrder(order.order_id)}
          >
            Cancelar pedido
          </button>
        )}
        
        {order.payment_status === 'pending' && order.payment_method === 'bank_transfer' && (
          <Link 
            to={`/payment-confirmation/${order.order_id}`} 
            className="confirm-payment-btn"
          >
            Confirmar pago
          </Link>
        )}
        
        <Link 
          to={`/orders/${order.order_id}`} 
          className="view-order-btn"
        >
          Ver detalles completos
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;