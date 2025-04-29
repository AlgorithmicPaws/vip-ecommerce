import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import '../../styles/OrderHistory.css';

// Components
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import OrderCard from './components/OrderCard';
import LoadingIndicator from '../ProductCatalog/subcomponents/LoadingIndicator';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch orders when component mounts
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    
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
  }, [isAuthenticated, navigate]);
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Helper function to format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price;
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
        
        alert('Pedido cancelado correctamente.');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('No se pudo cancelar el pedido. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };
  
  // Helper function to get order status text in Spanish
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
  
  // Helper function to get payment status text in Spanish
  const getPaymentStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'refunded': 'Reembolsado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="order-history-container">      
      <div className="order-history-content">
        <h1>Mis Pedidos</h1>
        
        {loading ? (
          <LoadingIndicator message="Cargando tus pedidos..." />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Reintentar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <h2>No tienes pedidos aún</h2>
            <p>Explora nuestro catálogo y realiza tu primera compra.</p>
            <Link to="/catalog" className="shop-now-btn">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <OrderCard 
                key={order.order_id}
                order={order}
                formatDate={formatDate}
                formatPrice={formatPrice}
                getOrderStatusText={getOrderStatusText}
                getPaymentStatusText={getPaymentStatusText}
                onCancelOrder={handleCancelOrder}
              />
            ))}
          </div>
        )}
        
        <div className="order-history-actions">
          <Link to="/catalog" className="continue-shopping-btn">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;