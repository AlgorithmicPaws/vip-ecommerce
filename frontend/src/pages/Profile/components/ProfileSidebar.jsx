import React from 'react';
import ProfileImage from '../subcomponents/ProfileImage';

const ProfileSidebar = ({ userData, activeTab, onTabChange, onLogout }) => {
  const tabs = [
    { id: 'personal', icon: '👤', label: 'Datos Personales' },
    { id: 'orders', icon: '📦', label: 'Mis Pedidos' },
    { id: 'addresses', icon: '📍', label: 'Direcciones' },
    { id: 'payments', icon: '💳', label: 'Métodos de Pago' },
    { id: 'reviews', icon: '⭐', label: 'Mis Reseñas' },
    { id: 'security', icon: '🔒', label: 'Seguridad' },
  ];

  return (
    <div className="profile-sidebar">
      <div className="sidebar-header">
        <ProfileImage 
          profileImage={userData.profileImage} 
          fullName={userData.fullName} 
          size="medium"
        />
        <h2 className="user-name">{userData.fullName}</h2>
        <p className="user-email">{userData.email}</p>
      </div>
      
      <nav className="profile-nav">
        <ul>
          {tabs.map(tab => (
            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''}>
              <button onClick={() => onTabChange(tab.id)}>
                <i className="nav-icon">{tab.icon}</i> {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <i className="nav-icon">🚪</i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;