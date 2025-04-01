// frontend/src/pages/Admin/components/AdminHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  // Estado para notificaciones
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      message: 'Nuevo pedido #1234',
      time: '2 min',
      read: false
    },
    {
      id: 2,
      type: 'review',
      message: 'Nueva reseña de 5 estrellas',
      time: '15 min',
      read: false
    },
    {
      id: 3,
      type: 'stock',
      message: 'Stock bajo para "Taladro DeWalt"',
      time: '1 hora',
      read: true
    }
  ]);
  
  // Estado para mostrar/ocultar menú de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estado para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  
  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Marcar notificación como leída
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  
  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar lógica de búsqueda
    console.log('Buscando:', searchQuery);
  };

  return (
    <header className="admin-header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      
      <div className="header-search">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar en todo el sistema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>
      
      <div className="header-actions">
        <div className="notifications-dropdown">
          <button 
            className="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="notification-icon">🔔</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-menu">
              <div className="notifications-header">
                <h3>Notificaciones</h3>
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={markAllAsRead}
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {notification.type === 'order' && '🛒'}
                        {notification.type === 'review' && '⭐'}
                        {notification.type === 'stock' && '📦'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    No hay notificaciones
                  </div>
                )}
              </div>
              
              <div className="notifications-footer">
                <Link to="/admin/notifications">Ver todas</Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="user-dropdown">
          <button className="user-btn">
            <div className="admin-avatar">JP</div>
            <span className="admin-name">Juan Pérez</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          <div className="user-menu">
            <Link to="/admin/profile" className="user-menu-item">
              <span className="menu-icon">👤</span>
              <span>Mi Perfil</span>
            </Link>
            <Link to="/admin/settings" className="user-menu-item">
              <span className="menu-icon">⚙️</span>
              <span>Configuración</span>
            </Link>
            <div className="menu-divider"></div>
            <button className="user-menu-item logout">
              <span className="menu-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;