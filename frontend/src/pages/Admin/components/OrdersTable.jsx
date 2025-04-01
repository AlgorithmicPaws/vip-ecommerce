// frontend/src/pages/Admin/components/OrdersTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OrdersTable = ({
  orders,
  loading,
  selectedOrders,
  onSelectAll,
  onSelectOrder,
  onUpdateStatus
}) => {
  // Estado para mostrar/ocultar menú de acciones por pedido
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  
  // Renderizar estado del pedido con etiqueta de color
  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Pendiente</span>;
      case 'processing':
        return <span className="status-badge processing">En proceso</span>;
      case 'completed':
        return <span className="status-badge completed">Completado</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelado</span>;
      case 'refunded':
        return <span className="status-badge refunded">Reembolsado</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };
  
  // Renderizar método de pago con icono
  const renderPaymentMethod = (method) => {
    let icon = '💳'; // Predeterminado
    let label = 'Desconocido';
    
    switch (method) {
      case 'credit_card':
        icon = '💳';
        label = 'Tarjeta';
        break;
      case 'paypal':
        icon = '🔄';
        label = 'PayPal';
        break;
      case 'transfer':
        icon = '🏦';
        label = 'Transferencia';
        break;
      case 'cash_on_delivery':
        icon = '💰';
        label = 'Contrareembolso';
        break;
      default:
        break;
    }
    
    return (
      <span className="payment-method">
        <span className="method-icon">{icon}</span>
        <span className="method-label">{label}</span>
      </span>
    );
  };
  
  // Alternar menú de acciones para un pedido
  const toggleActionMenu = (orderId) => {
    if (activeActionMenu === orderId) {
      setActiveActionMenu(null);
    } else {
      setActiveActionMenu(orderId);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-table-message">
        <p>No se encontraron pedidos con los filtros actuales.</p>
        <button className="clear-filters-btn">Limpiar Filtros</button>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="admin-table orders-table">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Items</th>
            <th>Pago</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => onSelectOrder(order.id)}
                />
              </td>
              <td>
                <Link to={`/admin/orders/${order.id}`} className="order-number">
                  {order.orderNumber}
                </Link>
                {order.notes && (
                  <span className="order-note-indicator" title={order.notes}>
                    📝
                  </span>
                )}
              </td>
              <td>{order.date}</td>
              <td>
                <div className="customer-info">
                  <span className="customer-name">{order.customerName}</span>
                  <span className="customer-email">{order.customerEmail}</span>
                </div>
              </td>
              <td>{renderStatus(order.status)}</td>
              <td className="order-total">${order.total.toFixed(2)}</td>
              <td className="items-count">{order.items}</td>
              <td>{renderPaymentMethod(order.paymentMethod)}</td>
              <td className="actions-cell">
                <div className="row-actions">
                  <Link to={`/admin/orders/${order.id}`} className="action-btn view" title="Ver detalles">
                    👁️
                  </Link>
                  <button 
                    className="action-btn more" 
                    title="Más acciones"
                    onClick={() => toggleActionMenu(order.id)}
                  >
                    ⋮
                  </button>
                  
                  {activeActionMenu === order.id && (
                    <div className="action-dropdown">
                      <button 
                        className="dropdown-item print"
                        title="Imprimir pedido"
                      >
                        🖨️ Imprimir
                      </button>
                      
                      <Link 
                        to={`/admin/orders/${order.id}/edit`}
                        className="dropdown-item edit"
                      >
                        ✏️ Editar
                      </Link>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item status"
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        disabled={order.status === 'processing'}
                      >
                        🔄 Marcar en proceso
                      </button>
                      
                      <button 
                        className="dropdown-item status"
                        onClick={() => onUpdateStatus(order.id, 'completed')}
                        disabled={order.status === 'completed'}
                      >
                        ✅ Marcar completado
                      </button>
                      
                      <button 
                        className="dropdown-item status"
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                        disabled={order.status === 'cancelled'}
                      >
                        ❌ Cancelar pedido
                      </button>
                      
                      <button 
                        className="dropdown-item status"
                        onClick={() => onUpdateStatus(order.id, 'refunded')}
                        disabled={order.status === 'refunded'}
                      >
                        💸 Marcar reembolsado
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;