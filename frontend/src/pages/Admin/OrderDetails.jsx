// frontend/src/pages/Admin/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import OrderStatusSelector from './subcomponents/OrderStatusSelector';
import OrderTimeline from './subcomponents/OrderTimeline';
import OrderItemsTable from './subcomponents/OrderItemsTable';
import ConfirmationModal from './subcomponents/ConfirmationModal';
import '../../styles/Admin.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Efecto para cargar los datos del pedido
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      // Simulación de carga desde API
      setTimeout(() => {
        // Datos simulados de pedido
        const mockOrder = {
          id: parseInt(orderId),
          orderNumber: `ORD-2025-${1000 + parseInt(orderId)}`,
          date: '2025-03-25',
          customer: {
            id: 101,
            name: 'Carlos Méndez',
            email: 'carlos.mendez@example.com',
            phone: '+34 612 345 678',
            registeredDate: '2023-05-12'
          },
          billing: {
            address: 'Calle Principal 123',
            city: 'Madrid',
            postalCode: '28001',
            state: 'Madrid',
            country: 'España'
          },
          shipping: {
            address: 'Calle Principal 123',
            city: 'Madrid',
            postalCode: '28001',
            state: 'Madrid',
            country: 'España',
            method: 'express',
            cost: 9.99,
            trackingNumber: 'TRK123456789'
          },
          payment: {
            method: 'credit_card',
            cardLast4: '4242',
            transactionId: 'TXN987654321',
            status: 'completed'
          },
          status: 'processing',
          subtotal: 245.97,
          discounts: 24.60,
          tax: 46.73,
          total: 278.09,
          items: [
            {
              id: 1,
              productId: 101,
              name: 'Taladro DeWalt 20V',
              sku: 'DW-123456',
              quantity: 1,
              price: 199.99,
              discount: 10,
              total: 179.99,
              image: null,
              attributes: ['Color: Amarillo', 'Voltaje: 20V']
            },
            {
              id: 2,
              productId: 202,
              name: 'Juego de Brocas Profesionales',
              sku: 'BR-567890',
              quantity: 2,
              price: 32.99,
              discount: 0,
              total: 65.98,
              image: null,
              attributes: ['Piezas: 24']
            }
          ],
          notes: 'Cliente solicitó entrega por la tarde',
          history: [
            {
              date: '2025-03-25T09:30:00',
              status: 'pending',
              note: 'Pedido recibido'
            },
            {
              date: '2025-03-25T10:15:00',
              status: 'processing',
              note: 'Pago confirmado'
            },
            {
              date: '2025-03-25T14:45:00',
              status: 'processing',
              note: 'Pedido en preparación'
            }
          ]
        };
        
        setOrder(mockOrder);
        setLoading(false);
      }, 1000);
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Actualizar el estado del pedido
  const updateOrderStatus = (newStatus) => {
    setOrder(prevOrder => {
      // En una implementación real, aquí se haría una llamada a la API
      
      const now = new Date().toISOString();
      const statusMessages = {
        pending: 'Pedido en espera',
        processing: 'Pedido en procesamiento',
        completed: 'Pedido completado',
        cancelled: 'Pedido cancelado',
        refunded: 'Pedido reembolsado'
      };
      
      return {
        ...prevOrder,
        status: newStatus,
        history: [
          ...prevOrder.history,
          {
            date: now,
            status: newStatus,
            note: statusMessages[newStatus] || 'Estado actualizado'
          }
        ]
      };
    });
  };
  
  // Cancelar pedido
  const handleCancelOrder = () => {
    updateOrderStatus('cancelled');
    setShowCancelModal(false);
  };
  
  // Imprimir pedido
  const handlePrintOrder = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <AdminSidebar />
        <div className="admin-content">
          <AdminHeader title="Detalles del Pedido" />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando detalles del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-dashboard-container">
        <AdminSidebar />
        <div className="admin-content">
          <AdminHeader title="Detalles del Pedido" />
          <div className="error-message">
            <p>No se encontró el pedido solicitado.</p>
            <Link to="/admin/orders" className="primary-btn">
              Volver a Pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      
      <div className="admin-content">
        <AdminHeader title={`Pedido ${order.orderNumber}`} />
        
        <div className="content-header with-actions">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={() => navigate('/admin/orders')}
            >
              ← Volver a Pedidos
            </button>
          </div>
          
          <div className="order-actions">
            <button 
              className="action-btn print"
              onClick={handlePrintOrder}
            >
              🖨️ Imprimir
            </button>
            
            <Link to={`/admin/orders/${orderId}/edit`} className="action-btn edit">
              ✏️ Editar
            </Link>
            
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <button 
                className="action-btn cancel"
                onClick={() => setShowCancelModal(true)}
              >
                ❌ Cancelar Pedido
              </button>
            )}
            
            <button className="action-btn more">
              ⋮ Más Acciones
            </button>
          </div>
        </div>
        
        <div className="order-details-grid">
          <div className="order-summary-card">
            <div className="order-status-header">
              <h3>Estado del Pedido</h3>
              <OrderStatusSelector 
                currentStatus={order.status} 
                onStatusChange={updateOrderStatus} 
              />
            </div>
            
            <div className="order-meta">
              <div className="meta-item">
                <span className="meta-label">Número de Pedido:</span>
                <span className="meta-value">{order.orderNumber}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Fecha:</span>
                <span className="meta-value">{order.date}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Pago:</span>
                <span className="meta-value">
                  {order.payment.method === 'credit_card' ? 
                    `Tarjeta terminada en ${order.payment.cardLast4}` : 
                    order.payment.method}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ID de Transacción:</span>
                <span className="meta-value">{order.payment.transactionId}</span>
              </div>
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discounts > 0 && (
                <div className="total-row discount">
                  <span>Descuentos:</span>
                  <span>-${order.discounts.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Envío:</span>
                <span>${order.shipping.cost.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Impuestos:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="customer-info-card">
            <h3>Información del Cliente</h3>
            <div className="customer-details">
              <div className="customer-main">
                <div className="customer-name">{order.customer.name}</div>
                <div className="customer-contact">
                  <div>{order.customer.email}</div>
                  <div>{order.customer.phone}</div>
                </div>
                <Link to={`/admin/customers/${order.customer.id}`} className="view-customer-btn">
                  Ver Perfil de Cliente
                </Link>
              </div>
              
              <div className="customer-addresses">
                <div className="billing-address">
                  <h4>Dirección de Facturación</h4>
                  <address>
                    {order.customer.name}<br />
                    {order.billing.address}<br />
                    {order.billing.city}, {order.billing.state} {order.billing.postalCode}<br />
                    {order.billing.country}
                  </address>
                </div>
                
                <div className="shipping-address">
                  <h4>Dirección de Envío</h4>
                  <address>
                    {order.customer.name}<br />
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}<br />
                    {order.shipping.country}
                  </address>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-items-card">
            <h3>Productos del Pedido</h3>
            <OrderItemsTable items={order.items} />
          </div>
          
          <div className="order-delivery-card">
            <h3>Información de Envío</h3>
            <div className="delivery-details">
              <div className="meta-item">
                <span className="meta-label">Método de Envío:</span>
                <span className="meta-value">
                  {order.shipping.method === 'express' ? 'Envío Express' : 'Envío Estándar'}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Número de Seguimiento:</span>
                <span className="meta-value">{order.shipping.trackingNumber}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Estado de Envío:</span>
                <span className="meta-value">
                  {order.status === 'completed' ? 'Entregado' : 
                    (order.status === 'processing' ? 'En preparación' : 'Pendiente')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="order-notes-card">
            <h3>Notas del Pedido</h3>
            <div className="order-notes">
              {order.notes ? (
                <p>{order.notes}</p>
              ) : (
                <p className="no-notes">No hay notas para este pedido</p>
              )}
              
              <button className="add-note-btn">
                + Añadir Nota
              </button>
            </div>
          </div>
          
          <div className="order-history-card">
            <h3>Historial del Pedido</h3>
            <OrderTimeline history={order.history} />
          </div>
        </div>
        
        {/* Modal de confirmación de cancelación */}
        {showCancelModal && (
          <ConfirmationModal 
            title="Cancelar Pedido"
            message="¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
            confirmText="Sí, Cancelar Pedido"
            cancelText="No, Mantener Pedido"
            onConfirm={handleCancelOrder}
            onCancel={() => setShowCancelModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetails;