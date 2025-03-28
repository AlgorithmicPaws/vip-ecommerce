import React from 'react';
import { Link } from 'react-router-dom';

const ManagementSidebar = () => {
  const menuItems = [
    { id: 'dashboard', label: 'Productos', icon: '📦', active: true },
    { id: 'orders', label: 'Pedidos', icon: '🛒' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'analytics', label: 'Analíticas', icon: '📊' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div className="product-management-sidebar">
      <div className="sidebar-header">
        <h2>Mi Tienda</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className={item.active ? 'active' : ''}>
              <a href={`#${item.id}`}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <Link to="/profile" className="profile-link">Mi Perfil</Link>
        <button className="logout-btn-sm">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default ManagementSidebar;