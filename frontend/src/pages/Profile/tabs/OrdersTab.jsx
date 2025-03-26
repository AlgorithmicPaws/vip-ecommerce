import React from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../subcomponents/OrderCard';
import OrderDetails from '../subcomponents/OrderDetails';

const OrdersTab = ({ orders, selectedOrder, setSelectedOrder }) => {
  // Ver detalles del pedido
  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    setSelectedOrder(order);
  };

  // Cerrar detalles del pedido
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-tab">
      <div className="section-header">
        <h2>Historial de Pedidos</h2>
      </div>
      
      {orders.length > 0 ? (
        <div className="orders-list">
          <div className="order-header-row">
            <div className="order-id">Pedido No.</div>
            <div className="order-date">Fecha</div>
            <div className="order-status">Estado</div>
            <div className="order-total">Total</div>
            <div className="order-actions">Acciones</div>
          </div>
          
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrder && selectedOrder.id === order.id}
              onViewDetails={() => handleViewOrder(order.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay pedidos todavía</h3>
          <p>Parece que aún no has realizado ninguna compra.</p>
          <Link to="/catalog" className="action-btn">Explorar Productos</Link>
        </div>
      )}
      
      {/* Modal de detalles del pedido */}
      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
        />
      )}
    </div>
  );
};

export default OrdersTab;