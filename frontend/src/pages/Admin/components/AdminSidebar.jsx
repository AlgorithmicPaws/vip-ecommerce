// frontend/src/pages/Admin/components/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Menú de navegación del administrador
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Panel de Control', 
      icon: '📊', 
      path: '/admin/dashboard'
    },
    { 
      id: 'products', 
      label: 'Productos', 
      icon: '📦',
      path: '/admin/products'
    },
    { 
      id: 'orders', 
      label: 'Pedidos', 
      icon: '🛒',
      path: '/admin/orders'
    },
    { 
      id: 'sellers', 
      label: 'Vendedores', 
      icon: '🏪',
      path: '/admin/sellers'
    },
    { 
      id: 'customers', 
      label: 'Clientes', 
      icon: '👥',
      path: '/admin/customers'
    },
    { 
      id: 'categories', 
      label: 'Categorías', 
      icon: '🏷️',
      path: '/admin/categories'
    },
    { 
      id: 'discounts', 
      label: 'Promociones', 
      icon: '🏷️',
      path: '/admin/promotions'
    },
    { 
      id: 'reviews', 
      label: 'Reseñas', 
      icon: '⭐',
      path: '/admin/reviews'
    },
    { 
      id: 'reports', 
      label: 'Informes', 
      icon: '📈',
      path: '/admin/reports',
      submenu: [
        { id: 'sales', label: 'Ventas', path: '/admin/reports/sales' },
        { id: 'inventory', label: 'Inventario', path: '/admin/reports/inventory' },
        { id: 'customers', label: 'Clientes', path: '/admin/reports/customers' }
      ]
    },
    { 
      id: 'settings', 
      label: 'Configuración', 
      icon: '⚙️',
      path: '/admin/settings'
    },
  ];

  // Comprobar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Manejar colapso del menú
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="admin-logo">
          <span className="logo-icon">🏗️</span>
          {!collapsed && <span className="logo-text">ConstructAdmin</span>}
        </Link>
        
        <button className="collapse-btn" onClick={toggleCollapse}>
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>
      
      <div className="admin-user-info">
        {!collapsed && <div className="admin-name">Juan Pérez</div>}
        <div className="admin-avatar">JP</div>
      </div>
      
      <nav className="admin-menu">
        <ul>
          {menuItems.map(item => (
            <li 
              key={item.id} 
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Link to={item.path} className="menu-link">
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && <span className="menu-text">{item.label}</span>}
                {!collapsed && item.submenu && <span className="submenu-arrow">▼</span>}
              </Link>
              
              {!collapsed && item.submenu && (
                <ul className="submenu">
                  {item.submenu.map(subitem => (
                    <li 
                      key={subitem.id} 
                      className={`submenu-item ${isActive(subitem.path) ? 'active' : ''}`}
                    >
                      <Link to={subitem.path}>
                        {subitem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/" className="view-store-btn">
          <span className="btn-icon">🏠</span>
          {!collapsed && <span className="btn-text">Ver Tienda</span>}
        </Link>
        
        <button className="logout-btn">
          <span className="btn-icon">🚪</span>
          {!collapsed && <span className="btn-text">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;