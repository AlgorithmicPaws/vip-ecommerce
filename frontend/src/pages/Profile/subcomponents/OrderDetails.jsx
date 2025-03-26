import React from 'react';

const OrderDetails = ({ order, onClose }) => {
  return (
    <div className="order-details-modal">
      <div className="modal-header">
        <h3>Detalles del Pedido {order.id}</h3>
        <button 
          className="close-btn"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      
      <div className="order-info">
        <div className="info-row">
          <span>Fecha:</span>
          <span>{order.date}</span>
        </div>
        <div className="info-row">
          <span>Estado:</span>
          <span className={`status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
      </div>
      
      <div className="order-items">
        <h4>Productos</h4>
        <table className="items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={`${order.id}-${item.id}`}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="order-summary">
        <div className="summary-row subtotal">
          <span>Subtotal:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div className="summary-row shipping">
          <span>Envío:</span>
          <span>Gratis</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="order-actions-footer">
        {order.status === 'Procesando' && (
          <button className="cancel-order-btn">Cancelar Pedido</button>
        )}
        <button className="track-order-btn">Seguir Pedido</button>
        <button className="reorder-btn">Volver a Comprar</button>
      </div>
    </div>
  );
};

export default OrderDetails;