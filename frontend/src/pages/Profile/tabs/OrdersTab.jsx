import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderService from '../../../services/orderService';
import OrderCard from '../subcomponents/OrderCard';
import OrderDetails from '../subcomponents/OrderDetails';

const OrdersTab = ({ selectedOrder, setSelectedOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await orderService.getOrderHistory();
        setOrders(response);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('No se pudieron cargar tus pedidos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Helper function to format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price;
  };
  
  // Get order status text in Spanish
  const getOrderStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'processing': 'En proceso',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };
  
  // Get payment status text in Spanish
  const getPaymentStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'refunded': 'Reembolsado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // View order details
  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order.order_id === orderId);
    setSelectedOrder(order);
  };
  
  // Close order details
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        const reason = prompt('Por favor, indica el motivo de la cancelación:');
        
        if (reason === null) return; // User clicked cancel on prompt
        
        if (reason.trim() === '') {
          alert('Debes proporcionar un motivo para cancelar el pedido.');
          return;
        }
        
        await orderService.cancelOrder(orderId, reason);
        
        // Update order in state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === orderId 
              ? { ...order, order_status: 'cancelled' } 
              : order
          )
        );
        
        // Update selected order if it's the one being cancelled
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder(prev => ({ ...prev, order_status: 'cancelled' }));
        }
        
        alert('Pedido cancelado correctamente.');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('No se pudo cancelar el pedido. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="orders-tab">
      <div className="section-header">
        <h2>Historial de Pedidos</h2>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Reintentar
          </button>
        </div>
      ) : orders.length > 0 ? (
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
              key={order.order_id}
              order={order}
              isSelected={selectedOrder && selectedOrder.order_id === order.order_id}
              onViewDetails={() => handleViewOrder(order.order_id)}
              onCancelOrder={() => handleCancelOrder(order.order_id)}
              formatDate={formatDate}
              formatPrice={formatPrice}
              getOrderStatusText={getOrderStatusText}
              getPaymentStatusText={getPaymentStatusText}
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
          formatDate={formatDate}
          formatPrice={formatPrice}
          getOrderStatusText={getOrderStatusText}
          getPaymentStatusText={getPaymentStatusText}
        />
      )}
    </div>
  );
};

export default OrdersTab;