import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import * as pdfService from '../../services/pdfService';
import '../../styles/OrderDetail.css';

// Components
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import LoadingIndicator from '../ProductCatalog/subcomponents/LoadingIndicator';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Fetch order details when component mounts
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/orders/${orderId}` } } });
      return;
    }
    
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        setError('No se pudo cargar el pedido. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
  
  // Calculate subtotal from items
  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
      const subtotal = typeof item.subtotal === 'number' ? item.subtotal : 
                      (item.price_per_unit * item.quantity);
      return total + subtotal;
    }, 0);
  };
  
  // Calculate shipping cost
  const calculateShippingCost = (orderData) => {
    if (!orderData || !orderData.order_items) return 0;
    
    const subtotal = calculateSubtotal(orderData.order_items);
    return orderData.total_amount - subtotal;
  };
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        const reason = prompt('Por favor, indica el motivo de la cancelación:');
        
        if (reason === null) return; // User clicked cancel on prompt
        
        if (reason.trim() === '') {
          alert('Debes proporcionar un motivo para cancelar el pedido.');
          return;
        }
        
        const updatedOrder = await orderService.cancelOrder(orderId, reason);
        setOrder(updatedOrder);
        
        alert('Pedido cancelado correctamente.');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('No se pudo cancelar el pedido. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };
  
  // Handle download invoice
  const handleDownloadInvoice = async () => {
    if (!order) return;
    
    setPdfLoading(true);
    try {
      // Generate invoice PDF
      const pdfBlob = await pdfService.generateOrderInvoice(order);
      
      // Download the PDF
      pdfService.savePdfToFile(pdfBlob, `factura-${order.order_id}.pdf`);
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Error al generar la factura. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setPdfLoading(false);
    }
  };
  
  // Check if order can be cancelled (only pending orders)
  const canBeCancelled = order && order.order_status === 'pending';
  
  // Get payment method text in Spanish
  const getPaymentMethodText = (method) => {
    const methodMap = {
      'bank_transfer': 'Transferencia bancaria',
      'credit_card': 'Tarjeta de crédito',
      'paypal': 'PayPal',
      'cash_on_delivery': 'Contrareembolso'
    };
    return methodMap[method] || method;
  };

  return (
    <div className="order-detail-container">      
      <div className="order-detail-content">
        <div className="order-detail-breadcrumbs">
          <Link to="/">Inicio</Link> &gt; 
          <Link to="/orders">Mis Pedidos</Link> &gt; 
          <span>Pedido #{orderId}</span>
        </div>
        
        {loading ? (
          <LoadingIndicator message="Cargando detalles del pedido..." />
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
        ) : order ? (
          <div className="order-detail-card">
            <div className="order-detail-header">
              <div className="order-basic-info">
                <h1>Pedido #{order.order_id}</h1>
                <p className="order-date">Realizado el {formatDate(order.order_date)}</p>
              </div>
              
              <div className="order-status-info">
                <div className={`order-status-badge ${getStatusColorClass(order.order_status)}`}>
                  {getOrderStatusText(order.order_status)}
                </div>
                <div className="order-payment-info">
                  <span className="payment-method">{getPaymentMethodText(order.payment_method)}</span>
                  <span className="payment-status">{getPaymentStatusText(order.payment_status)}</span>
                </div>
              </div>
            </div>
            
            <div className="order-detail-sections">
              <div className="order-address-section">
                <div className="shipping-address">
                  <h3>Dirección de Envío</h3>
                  <div className="address-box">
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
                
                {order.billing_address && (
                  <div className="billing-address">
                    <h3>Dirección de Facturación</h3>
                    <div className="address-box">
                      <p>{order.billing_address.street}</p>
                      <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip_code}</p>
                      <p>{order.billing_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="order-items-section">
                <h3>Productos</h3>
                <div className="items-table">
                  <div className="items-header">
                    <span className="item-product-col">Producto</span>
                    <span className="item-price-col">Precio</span>
                    <span className="item-quantity-col">Cantidad</span>
                    <span className="item-total-col">Total</span>
                  </div>
                  
                  <div className="items-body">
                    {order.order_items.map(item => (
                      <div key={item.order_item_id} className="item-row">
                        <div className="item-product-cell">
                          <Link to={`/catalog/product/${item.product_id}`}>
                            {item.name || `Producto #${item.product_id}`}
                          </Link>
                        </div>
                        <div className="item-price-cell">${formatPrice(item.price_per_unit)}</div>
                        <div className="item-quantity-cell">{item.quantity}</div>
                        <div className="item-total-cell">${formatPrice(item.subtotal)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="order-summary-section">
                <h3>Resumen del Pedido</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${formatPrice(calculateSubtotal(order.order_items))}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Gastos de envío:</span>
                    <span>${formatPrice(calculateShippingCost(order))}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
              
              {order.payment_method === 'bank_transfer' && (
                <div className="payment-details-section">
                  <h3>Detalles de Pago</h3>
                  <div className="bank-transfer-details">
                    <p><strong>Banco:</strong> Bancolombia</p>
                    <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
                    <p><strong>Cuenta Corriente:</strong> 69812345678</p>
                    <p><strong>Concepto:</strong> Pedido {order.order_id}</p>
                    <p><strong>Importe:</strong> ${formatPrice(order.total_amount)}</p>
                  </div>
                </div>
              )}
              
              {order.tracking_number && (
                <div className="tracking-section">
                  <h3>Seguimiento del Envío</h3>
                  <div className="tracking-info">
                    <p><strong>Número de seguimiento:</strong> {order.tracking_number}</p>
                    <a 
                      href={`https://track.com/${order.tracking_number}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="track-btn"
                    >
                      Seguir envío
                    </a>
                  </div>
                </div>
              )}
              
              {order.notes && (
                <div className="notes-section">
                  <h3>Notas</h3>
                  <div className="notes-content">
                    <p>{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="order-detail-actions">
              <Link to="/orders" className="back-to-orders-btn">
                Volver a Mis Pedidos
              </Link>
              
              <button 
                onClick={handleDownloadInvoice}
                className="download-invoice-btn"
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Generando...' : 'Descargar Factura'}
              </button>
              
              {canBeCancelled && (
                <button 
                  onClick={handleCancelOrder}
                  className="cancel-order-btn"
                >
                  Cancelar Pedido
                </button>
              )}
              
              {order.order_status === 'pending' && order.payment_status === 'pending' && (
                <Link to={`/payment-confirmation/${order.order_id}`} className="confirm-payment-btn">
                  Confirmar Pago
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="not-found-message">
            <h2>Pedido no encontrado</h2>
            <p>No se pudo encontrar un pedido con el ID {orderId}.</p>
            <Link to="/orders" className="back-to-orders-btn">
              Volver a Mis Pedidos
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrderDetail;