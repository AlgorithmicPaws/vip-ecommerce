import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/apiService';
import * as userService from '../../services/userService';
import '../../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, isSeller } = useAuth();
  
  // State for user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal-info');
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch full user information from the API
        const userData = await api.get('/user-info/me');
        setUser(userData);
        
        // Initialize form data with user info
        setFormData({
          first_name: userData.user.first_name,
          last_name: userData.user.last_name,
          email: userData.user.email,
          phone: userData.user.phone || '',
          address: userData.user.address || ''
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data if canceling edit
    if (isEditing) {
      setFormData({
        first_name: user.user.first_name,
        last_name: user.user.last_name,
        email: user.user.email,
        phone: user.user.phone || '',
        address: user.user.address || ''
      });
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user profile
      const updatedUserData = await userService.updateUserProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || null,
        address: formData.address || null
      });
      
      // Refresh user data
      const userData = await api.get('/user-info/me');
      setUser(userData);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading && !user) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <div className="profile-image-container">
            <div className="profile-placeholder">
              {user?.user.first_name?.charAt(0) || 'U'}
            </div>
          </div>
          <h2 className="user-name">{user?.user.first_name} {user?.user.last_name}</h2>
          <p className="user-email">{user?.user.email}</p>
        </div>
        
        <nav className="profile-nav">
          <ul>
            <li className={activeTab === 'personal-info' ? 'active' : ''}>
              <button onClick={() => handleTabChange('personal-info')}>
                <span className="nav-icon">👤</span>
                Información Personal
              </button>
            </li>
            <li className={activeTab === 'orders' ? 'active' : ''}>
              <button onClick={() => handleTabChange('orders')}>
                <span className="nav-icon">📦</span>
                Mis Pedidos
              </button>
            </li>
            <li className={activeTab === 'addresses' ? 'active' : ''}>
              <button onClick={() => handleTabChange('addresses')}>
                <span className="nav-icon">📍</span>
                Direcciones
              </button>
            </li>
            {isSeller && (
              <li className={activeTab === 'seller' ? 'active' : ''}>
                <button onClick={() => handleTabChange('seller')}>
                  <span className="nav-icon">🏪</span>
                  Perfil de Vendedor
                </button>
              </li>
            )}
            <li className={activeTab === 'security' ? 'active' : ''}>
              <button onClick={() => handleTabChange('security')}>
                <span className="nav-icon">🔒</span>
                Seguridad
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-header">
          <h1>
            {activeTab === 'personal-info' && 'Información Personal'}
            {activeTab === 'orders' && 'Mis Pedidos'}
            {activeTab === 'addresses' && 'Direcciones'}
            {activeTab === 'seller' && 'Perfil de Vendedor'}
            {activeTab === 'security' && 'Seguridad'}
          </h1>
          <p className="breadcrumb">
            <a href="/">Inicio</a> / Mi Perfil / 
            {activeTab === 'personal-info' && ' Información Personal'}
            {activeTab === 'orders' && ' Mis Pedidos'}
            {activeTab === 'addresses' && ' Direcciones'}
            {activeTab === 'seller' && ' Perfil de Vendedor'}
            {activeTab === 'security' && ' Seguridad'}
          </p>
        </div>

        <div className="tab-content">
          {/* Personal Information Tab */}
          {activeTab === 'personal-info' && (
            <>
              <div className="section-header">
                <h2>Datos de Usuario</h2>
                <button onClick={handleEditToggle} className="edit-btn">
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
              </div>
              
              {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="first_name">Nombres</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name">Apellidos</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Correo Electrónico</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="address">Dirección</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" onClick={handleEditToggle} className="cancel-btn">
                      Cancelar
                    </button>
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-display">
                  <div className="info-section">
                    <h3>Datos Personales</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Nombres</span>
                        <span className="info-value">{user?.user.first_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Apellidos</span>
                        <span className="info-value">{user?.user.last_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Correo Electrónico</span>
                        <span className="info-value">{user?.user.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{user?.user.phone || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3>Dirección</h3>
                    <p className="info-value">
                      {user?.user.address || 'No hay dirección especificada'}
                    </p>
                  </div>
                  
                  <div className="info-section">
                    <h3>Tipo de Cuenta</h3>
                    <div className="preferences-display">
                      {user?.roles.map((role, index) => (
                        <span 
                          key={index} 
                          className="preference-badge active"
                        >
                          {role === 'user' ? 'Usuario' : 
                           role === 'seller' ? 'Vendedor' : 
                           role === 'admin' ? 'Administrador' : role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No hay pedidos aún</h3>
              <p>Todavía no has realizado ningún pedido.</p>
              <a href="/catalog" className="action-btn">Explorar Productos</a>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <h3>No hay direcciones guardadas</h3>
              <p>Añade direcciones para agilizar tus compras.</p>
              <button className="action-btn">Añadir Dirección</button>
            </div>
          )}

          {/* Seller Profile Tab */}
          {activeTab === 'seller' && isSeller && (
            <>
              <div className="section-header">
                <h2>Perfil de Vendedor</h2>
                <a href="/products" className="edit-btn">Gestionar Productos</a>
              </div>
              
              <div className="info-display">
                <div className="info-section">
                  <h3>Estado de Vendedor</h3>
                  <p>Tu cuenta está configurada como vendedor. Puedes gestionar tus productos y ver tus estadísticas de ventas.</p>
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <div className="section-header">
                <h2>Seguridad de la Cuenta</h2>
              </div>
              
              <div className="security-section">
                <h3>Cambiar Contraseña</h3>
                <div className="security-form">
                  <div className="form-group">
                    <label htmlFor="current_password">Contraseña Actual</label>
                    <input type="password" id="current_password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new_password">Nueva Contraseña</label>
                    <input type="password" id="new_password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm_password">Confirmar Contraseña</label>
                    <input type="password" id="confirm_password" />
                  </div>
                  <button className="save-btn">Actualizar Contraseña</button>
                </div>
              </div>
              
              <div className="security-section">
                <h3>Danger Zone</h3>
                <div className="danger-zone">
                  <div className="danger-actions">
                    <div className="danger-action">
                      <div>
                        <h4>Descargar Mis Datos</h4>
                        <p>Descarga toda la información de tu cuenta en formato JSON.</p>
                      </div>
                      <button className="download-btn">Descargar</button>
                    </div>
                    <div className="danger-action">
                      <div>
                        <h4>Eliminar Mi Cuenta</h4>
                        <p>Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.</p>
                      </div>
                      <button className="delete-account-btn">Eliminar Cuenta</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Profile;