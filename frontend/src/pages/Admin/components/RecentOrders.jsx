// frontend/src/pages/Admin/components/RecentOrders.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecentOrders = () => {
  // Datos de pedidos recientes (simulados)
  const recentOrders = [
    {
      id: 'ORD-2025-1234',
      customer: 'Carlos Méndez',
      date: '31/03/2025',
      total: 356.99,
      status: 'completed',
      items: 5
    },
    {
      id: 'ORD-2025-1233',
      customer: 'Ana Martínez',
      date: '31/03/2025',
      total: 124.50,
      status: 'processing',
      items: 2
    },
    {
      id: 'ORD-2025-1232',
      customer: 'Roberto García',
      date: '30/03/2025',
      total: 895.75,
      status: 'processing',
      items: 8
    },
    {
      id: 'ORD-2025-1231',
      customer: 'Laura Sánchez',
      date: '30/03/2025',
      total: 78.25,
      status: 'completed',
      items: 1
    },
    {
      id: 'ORD-2025-1230',
      customer: 'Miguel Fernández',
      date: '29/03/2025',
      total: 245.99,
      status: 'cancelled',
      items: 3
    }
  ];

  // Función para renderizar el estado del pedido con colores
  const renderStatus = (status) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Completado</span>;
      case 'processing':
        return <span className="status-badge processing">En proceso</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelado</span>;
      case 'pending':
        return <span className="status-badge pending">Pendiente</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="recent-orders-card">
      <div className="card-header">
        <h3 className="card-title">Pedidos Recientes</h3>
        <Link to="/admin/orders" className="view-all-link">
          Ver todos
        </Link>
      </div>
      
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Artículos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <Link to={`/admin/orders/${order.id}`} className="order-id-link">
                    {order.id}
                  </Link>
                </td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td className="order-total">${order.total.toFixed(2)}</td>
                <td>{renderStatus(order.status)}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/orders/${order.id}`} className="view-btn" title="Ver detalles">
                      👁️
                    </Link>
                    <button className="more-btn" title="Más opciones">
                      ⋮
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;