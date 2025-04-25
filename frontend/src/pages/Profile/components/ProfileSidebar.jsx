import React from 'react';
import ProfileImage from '../subcomponents/ProfileImage';

const ProfileSidebar = ({ userData, activeTab, onTabChange, onLogout, isSeller }) => {
  // Define tabs that should be visible
  // We're showing only implemented tabs

  return (
    <div className="profile-sidebar">
      <div className="sidebar-header">
        <ProfileImage 
          profileImage={userData.profileImage} 
          fullName={`${userData.first_name || ''} ${userData.last_name || ''}`}
          size="medium"
        />
        <h2 className="user-name">{userData.first_name} {userData.last_name}</h2>
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