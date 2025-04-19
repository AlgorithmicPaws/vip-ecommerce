import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/apiService';
import * as userService from '../../services/userService';
import * as orderService from '../../services/orderService';
import '../../styles/Profile.css';
import '../../styles/OrderHistoryStyles.css';

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

  // State for orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State for password change form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // State for security section loading and errors
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(null);
  
  // State for delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Function to fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      const response = await orderService.getOrderHistory();
      setOrders(response);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError('No se pudieron cargar tus pedidos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Reset any success/error messages when changing tabs
    if (tabId === 'security') {
      setSecurityError(null);
      setSecuritySuccess(null);
    }
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

  // Handle password form input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
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

  // Handle password update submission
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);
    
    // Validate passwords match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setSecurityError('Las contraseñas nuevas no coinciden');
      setSecurityLoading(false);
      return;
    }
    
    // Validate password length
    if (passwordForm.new_password.length < 8) {
      setSecurityError('La contraseña debe tener al menos 8 caracteres');
      setSecurityLoading(false);
      return;
    }
    
    try {
      // Call API to update password
      await userService.updatePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      
      // Reset form and show success message
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      setSecuritySuccess('Contraseña actualizada correctamente');
    } catch (err) {
      console.error('Failed to update password:', err);
      setSecurityError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setSecurityLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setSecurityLoading(true);
      
      // Call API to delete account
      await userService.deleteUserAccount();
      
      // Logout and redirect to home
      alert('Tu cuenta ha sido eliminada correctamente');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setSecurityError(err.message || 'Error al eliminar la cuenta');
      setSecurityLoading(false);
    }
  };

  // View order details
  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order.order_id === orderId);
    setSelectedOrder(order);
  };
  
  // Close order details
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        const reason = prompt('Por favor, indica el motivo de la cancelación:');
        
        if (reason === null) return; // User clicked cancel on prompt
        
        if (reason.trim() === '') {
          alert('Debes proporcionar un motivo para cancelar el pedido.');
          return;
        }
        
        await orderService.cancelOrder(orderId, reason);
        
        // Update order in state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === orderId 
              ? { ...order, order_status: 'cancelled' } 
              : order
          )
        );
        
        // Update selected order if it's the one being cancelled
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder(prev => ({ ...prev, order_status: 'cancelled' }));
        }
        
        alert('Pedido cancelado correctamente.');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('No se pudo cancelar el pedido. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Helper function to format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price;
  };
  
  // Get order status text in Spanish
  const getOrderStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'processing': 'En proceso',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };
  
  // Get payment status text in Spanish
  const getPaymentStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'refunded': 'Reembolsado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Helper function to get status color class
  const getStatusColorClass = (status) => {
    const statusColorMap = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusColorMap[status] || 'status-default';
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
            <div className="orders-tab">
              <div className="section-header">
                <h2>Historial de Pedidos</h2>
              </div>
              
              {ordersLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando tus pedidos...</p>
                </div>
              ) : ordersError ? (
                <div className="error-state">
                  <p>{ordersError}</p>
                  <button onClick={fetchOrders} className="retry-btn">
                    Reintentar
                  </button>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  <div className="order-header-row">
                    <div className="order-id">Pedido No.</div>
                    <div className="order-date">Fecha</div>
                    <div className="order-status">Estado</div>
                    <div className="order-total">Total</div>
                    <div className="order-actions">Acciones</div>
                  </div>
                  
                  {orders.map(order => (
                    <div 
                      key={order.order_id} 
                      className={`order-item ${selectedOrder && selectedOrder.order_id === order.order_id ? 'selected' : ''}`}
                    >
                      <div className="order-id">#{order.order_id}</div>
                      <div className="order-date">{formatDate(order.order_date)}</div>
                      <div className={`order-status ${getStatusColorClass(order.order_status)}`}>
                        {getOrderStatusText(order.order_status)}
                        <span className="payment-badge">
                          {getPaymentStatusText(order.payment_status)}
                        </span>
                      </div>
                      <div className="order-total">${formatPrice(order.total_amount)}</div>
                      <div className="order-actions">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewOrder(order.order_id)}
                        >
                          Ver Detalles
                        </button>
                        
                        {order.order_status === 'pending' && (
                          <button 
                            className="cancel-btn"
                            onClick={() => handleCancelOrder(order.order_id)}
                          >
                            Cancelar
                          </button>
                        )}
                        
                        {order.tracking_number && (
                          <a 
                            href={`https://track.com/${order.tracking_number}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="track-btn"
                          >
                            Seguir Envío
                          </a>
                        )}
                        
                        {order.payment_status === 'pending' && order.payment_method === 'bank_transfer' && (
                          <Link 
                            to={`/payment-confirmation/${order.order_id}`} 
                            className="payment-btn"
                          >
                            Confirmar Pago
                          </Link>
                        )}
                        
                        <Link 
                          to={`/orders/${order.order_id}`} 
                          className="detail-link"
                        >
                          Ver Completo
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No hay pedidos aún</h3>
                  <p>Todavía no has realizado ningún pedido.</p>
                  <a href="/catalog" className="action-btn">Explorar Productos</a>
                </div>
              )}
              
              {/* Order Details Modal */}
              {selectedOrder && (
                <div className="order-details-modal">
                  <div className="modal-header">
                    <h3>Detalles del Pedido #{selectedOrder.order_id}</h3>
                    <button 
                      className="close-btn"
                      onClick={handleCloseOrderDetails}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="order-info-grid">
                      <div className="order-info-section">
                        <h4>Información del Pedido</h4>
                        <div className="info-row">
                          <span className="info-label">Fecha:</span>
                          <span className="info-value">{formatDate(selectedOrder.order_date)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Estado:</span>
                          <span className="info-value status-badge">{getOrderStatusText(selectedOrder.order_status)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Pago:</span>
                          <span className="info-value">{getPaymentStatusText(selectedOrder.payment_status)}</span>
                        </div>
                        {selectedOrder.tracking_number && (
                          <div className="info-row">
                            <span className="info-label">Seguimiento:</span>
                            <span className="info-value">{selectedOrder.tracking_number}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="order-info-section">
                        <h4>Dirección de Envío</h4>
                        <div className="address-box">
                          <p>{selectedOrder.shipping_address.street}</p>
                          <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip_code}</p>
                          <p>{selectedOrder.shipping_address.country}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-items-section">
                      <h4>Productos</h4>
                      <div className="items-table">
                        <div className="items-header">
                          <span className="item-name-col">Producto</span>
                          <span className="item-price-col">Precio</span>
                          <span className="item-qty-col">Cantidad</span>
                          <span className="item-total-col">Total</span>
                        </div>
                        
                        <div className="items-list">
                          {selectedOrder.order_items.map(item => (
                            <div key={item.order_item_id} className="item-row">
                              <div className="item-name">
                                <Link to={`/catalog/product/${item.product_id}`}>
                                  {item.name || `Producto #${item.product_id}`}
                                </Link>
                              </div>
                              <div className="item-price">${formatPrice(item.price_per_unit)}</div>
                              <div className="item-qty">{item.quantity}</div>
                              <div className="item-total">${formatPrice(item.subtotal || (item.price_per_unit * item.quantity))}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-totals-section">
                      <div className="totals-row">
                        <span>Subtotal:</span>
                        <span>${formatPrice(calculateSubtotal(selectedOrder.order_items))}</span>
                      </div>
                      
                      <div className="totals-row">
                        <span>Envío:</span>
                        <span>${formatPrice(calculateShippingCost(selectedOrder))}</span>
                      </div>
                      
                      <div className="totals-row total">
                        <span>Total:</span>
                        <span>${formatPrice(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                    
                    {selectedOrder.payment_method === 'bank_transfer' && (
                      <div className="payment-info-section">
                        <h4>Información de Pago</h4>
                        <div className="payment-method">
                          <strong>Método de pago:</strong> Transferencia bancaria
                        </div>
                        
                        {selectedOrder.payment_status === 'pending' && (
                          <div className="bank-details">
                            <p><strong>Banco:</strong> Bancolombia</p>
                            <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
                            <p><strong>Cuenta Corriente:</strong> 69812345678</p>
                            <p><strong>Concepto:</strong> Pedido {selectedOrder.order_id}</p>
                            <p><strong>Importe:</strong> ${formatPrice(selectedOrder.total_amount)}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedOrder.notes && (
                      <div className="notes-section">
                        <h4>Notas</h4>
                        <p>{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-footer">
                    <div className="action-buttons">
                      <button onClick={handleCloseOrderDetails} className="close-detail-btn">
                        Cerrar
                      </button>
                      
                      <Link to={`/orders/${selectedOrder.order_id}`} className="full-detail-btn">
                        Ver Página Completa
                      </Link>
                    </div>
                  </div>
                </div>
              )}
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
              
              {securitySuccess && (
                <div className="success-message">
                  <p>{securitySuccess}</p>
                </div>
              )}
              
              {securityError && (
                <div className="error-message">
                  <p>{securityError}</p>
                </div>
              )}
              
              <div className="security-section">
                <h3>Cambiar Contraseña</h3>
                <form onSubmit={handleUpdatePassword} className="security-form">
                  <div className="form-group">
                    <label htmlFor="current_password">Contraseña Actual</label>
                    <input 
                      type="password" 
                      id="current_password" 
                      name="current_password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new_password">Nueva Contraseña</label>
                    <input 
                      type="password" 
                      id="new_password" 
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />
                    <small className="form-hint">Mínimo 8 caracteres, debe incluir al menos una letra y un número</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm_password">Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      id="confirm_password" 
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={securityLoading}
                  >
                    {securityLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              </div>
              
              <div className="security-section">
                <h3>Zona de Peligro</h3>
                <div className="danger-zone">
                  <div className="danger-actions">
                    <div className="danger-action">
                      <div>
                        <h4>Eliminar Mi Cuenta</h4>
                        <p>Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.</p>
                      </div>
                      {!showDeleteConfirm ? (
                        <button 
                          className="delete-account-btn" 
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Eliminar Cuenta
                        </button>
                      ) : (
                        <div className="delete-confirmation">
                          <p className="confirmation-text">¿Estás seguro? Esta acción no se puede deshacer.</p>
                          <div className="confirmation-buttons">
                            <button 
                              className="cancel-btn" 
                              onClick={() => setShowDeleteConfirm(false)}
                            >
                              Cancelar
                            </button>
                            <button 
                              className="confirm-delete-btn" 
                              onClick={handleDeleteAccount}
                              disabled={securityLoading}
                            >
                              {securityLoading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                            </button>
                          </div>
                        </div>
                      )}
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
};

// Helper function to calculate subtotal from items
const calculateSubtotal = (items) => {
  return items.reduce((total, item) => {
    const subtotal = typeof item.subtotal === 'number' ? item.subtotal : 
                    (item.price_per_unit * item.quantity);
    return total + subtotal;
  }, 0);
};

// Helper function to calculate shipping cost
const calculateShippingCost = (orderData) => {
  if (!orderData || !orderData.order_items) return 0;
  
  const subtotal = calculateSubtotal(orderData.order_items);
  return orderData.total_amount - subtotal;
};

export default Profile;