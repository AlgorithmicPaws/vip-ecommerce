import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetails = ({ 
  order, 
  onClose,
  formatDate,
  formatPrice,
  getOrderStatusText,
  getPaymentStatusText 
}) => {
  // Helper function to calculate subtotal from items
  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
      const subtotal = typeof item.subtotal === 'number' ? item.subtotal : 
                       (item.price_per_unit * item.quantity);
      return total + subtotal;
    }, 0);
  };
  
  // Helper function to calculate shipping cost
  const calculateShippingCost = (orderData) => {
    if (!orderData || !orderData.order_items) return 0;
    
    const subtotal = calculateSubtotal(orderData.order_items);
    return orderData.total_amount - subtotal;
  };

  return (
    <div className="order-details-modal">
      <div className="modal-header">
        <h3>Detalles del Pedido #{order.order_id}</h3>
        <button 
          className="close-btn"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      
      <div className="modal-body">
        <div className="order-info-grid">
          <div className="order-info-section">
            <h4>Información del Pedido</h4>
            <div className="info-row">
              <span className="info-label">Fecha:</span>
              <span className="info-value">{formatDate(order.order_date)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Estado:</span>
              <span className="info-value status-badge">{getOrderStatusText(order.order_status)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Pago:</span>
              <span className="info-value">{getPaymentStatusText(order.payment_status)}</span>
            </div>
            {order.tracking_number && (
              <div className="info-row">
                <span className="info-label">Seguimiento:</span>
                <span className="info-value">{order.tracking_number}</span>
              </div>
            )}
          </div>
          
          <div className="order-info-section">
            <h4>Dirección de Envío</h4>
            <div className="address-box">
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        </div>
        
        <div className="order-items-section">
          <h4>Productos</h4>
          <div className="items-table">
            <div className="items-header">
              <span className="item-name-col">Producto</span>
              <span className="item-price-col">Precio</span>
              <span className="item-qty-col">Cantidad</span>
              <span className="item-total-col">Total</span>
            </div>
            
            <div className="items-list">
              {order.order_items.map(item => (
                <div key={item.order_item_id} className="item-row">
                  <div className="item-name">
                    <Link to={`/catalog/product/${item.product_id}`}>
                      {item.name || `Producto #${item.product_id}`}
                    </Link>
                  </div>
                  <div className="item-price">${formatPrice(item.price_per_unit)}</div>
                  <div className="item-qty">{item.quantity}</div>
                  <div className="item-total">${formatPrice(item.subtotal || (item.price_per_unit * item.quantity))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="order-totals-section">
          <div className="totals-row">
            <span>Subtotal:</span>
            <span>${formatPrice(calculateSubtotal(order.order_items))}</span>
          </div>
          
          <div className="totals-row">
            <span>Envío:</span>
            <span>${formatPrice(calculateShippingCost(order))}</span>
          </div>
          
          <div className="totals-row total">
            <span>Total:</span>
            <span>${formatPrice(order.total_amount)}</span>
          </div>
        </div>
        
        {order.payment_method === 'bank_transfer' && (
          <div className="payment-info-section">
            <h4>Información de Pago</h4>
            <div className="payment-method">
              <strong>Método de pago:</strong> Transferencia bancaria
            </div>
            
            {order.payment_status === 'pending' && (
              <div className="bank-details">
                <p><strong>Banco:</strong> Bancolombia</p>
                <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
                <p><strong>Cuenta Corriente:</strong> 69812345678</p>
                <p><strong>Concepto:</strong> Pedido {order.order_id}</p>
                <p><strong>Importe:</strong> ${formatPrice(order.total_amount)}</p>
              </div>
            )}
          </div>
        )}
        
        {order.notes && (
          <div className="notes-section">
            <h4>Notas</h4>
            <p>{order.notes}</p>
          </div>
        )}
      </div>
      
      <div className="modal-footer">
        <div className="action-buttons">
          <button onClick={onClose} className="close-detail-btn">
            Cerrar
          </button>
          
          <Link to={`/orders/${order.order_id}`} className="full-detail-btn">
            Ver Página Completa
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;