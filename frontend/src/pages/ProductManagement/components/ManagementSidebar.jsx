import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ManagementSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Ahora solo tenemos las opciones de Productos y Pedidos (sin emojis)
  const menuItems = [
    { id: 'dashboard', label: 'Productos', active: true },
    { id: 'orders', label: 'Pedidos' }
  ];

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="product-management-sidebar">
      <div className="sidebar-header">
        <h2>VIP Market</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className={item.active ? 'active' : ''}>
              <a href={`#${item.id}`}>
                <span className="menu-text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <Link 
          to="/profile" 
          className="profile-link"
          style={{
            display: 'block',
            padding: '10px 20px',
            backgroundColor: 'rgba(242, 169, 0, 0.1)',
            color: '#F2A900',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 0 10px 0',
            transition: 'all 0.3s ease'
          }}
        >
          Mi Perfil
        </Link>
        <button 
          className="logout-btn-sm"
          onClick={handleLogout}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 20px',
            backgroundColor: '#F2A900',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ManagementSidebar;