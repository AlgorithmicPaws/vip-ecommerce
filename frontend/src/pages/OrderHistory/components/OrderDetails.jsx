import React from 'react';

const OrderDetails = ({ 
  order, 
  formatDate, 
  formatPrice,
  getOrderStatusText,
  getPaymentStatusText 
}) => {
  return (
    <div className="order-details">
      <div className="details-section">
        <h3>Detalles del Pedido</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Número de pedido:</span>
            <span className="detail-value">{order.order_id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha de pedido:</span>
            <span className="detail-value">{formatDate(order.order_date)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estado del pedido:</span>
            <span className="detail-value">{getOrderStatusText(order.order_status)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estado del pago:</span>
            <span className="detail-value">{getPaymentStatusText(order.payment_status)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Método de pago:</span>
            <span className="detail-value">
              {order.payment_method === 'bank_transfer' ? 'Transferencia bancaria' : order.payment_method}
            </span>
          </div>
          {order.tracking_number && (
            <div className="detail-item">
              <span className="detail-label">Número de seguimiento:</span>
              <span className="detail-value">{order.tracking_number}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="details-section">
        <h3>Dirección de Envío</h3>
        <div className="address-box">
          <p>{order.shipping_address.street}</p>
          <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
          <p>{order.shipping_address.country}</p>
        </div>
      </div>
      
      {order.billing_address && (
        <div className="details-section">
          <h3>Dirección de Facturación</h3>
          <div className="address-box">
            <p>{order.billing_address.street}</p>
            <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip_code}</p>
            <p>{order.billing_address.country}</p>
          </div>
        </div>
      )}
      
      <div className="details-section">
        <h3>Resumen de Costos</h3>
        <div className="cost-summary">
          <div className="cost-row">
            <span>Subtotal:</span>
            <span>${formatPrice(calculateSubtotal(order.order_items))}</span>
          </div>
          
          {/* Calculate shipping cost (the difference between total and subtotal) */}
          {getShippingCost(order) > 0 && (
            <div className="cost-row">
              <span>Envío:</span>
              <span>${formatPrice(getShippingCost(order))}</span>
            </div>
          )}
          
          {/* Discount would go here if we had that information */}
          
          <div className="cost-row total">
            <span>Total:</span>
            <span>${formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
      
      {order.notes && (
        <div className="details-section">
          <h3>Notas</h3>
          <div className="notes-box">
            <p>{order.notes}</p>
          </div>
        </div>
      )}
      
      {order.payment_method === 'bank_transfer' && (
        <div className="details-section bank-details">
          <h3>Datos Bancarios para Transferencia</h3>
          <div className="bank-info-box">
            <p><strong>Banco:</strong> Bancolombia</p>
            <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
            <p><strong>Cuenta Corriente:</strong> 69812345678</p>
            <p><strong>Concepto:</strong> Pedido {order.order_id}</p>
            <p><strong>Importe:</strong> ${formatPrice(order.total_amount)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate subtotal from items
const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

// Helper function to calculate shipping cost
const getShippingCost = (order) => {
  // Calculate shipping as the difference between total and subtotal
  // In a real app, this would likely be stored directly in the order
  const subtotal = calculateSubtotal(order.order_items);
  return order.total_amount - subtotal;
};

export default OrderDetails;