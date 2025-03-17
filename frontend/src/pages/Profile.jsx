import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Estado para controlar pestaña activa
  const [activeTab, setActiveTab] = useState('personal');

  // Datos de usuario simulados - en una aplicación real vendría de una API/backend
  const [userData, setUserData] = useState({
    fullName: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    phone: '+34 612 345 678',
    address: 'Calle Principal 123, Madrid',
    company: 'Constructora Pérez S.L.',
    birthday: '1985-06-15',
    taxId: 'B-12345678',
    bio: 'Contratista especializado en reformas residenciales con más de 10 años de experiencia.',
    profileImage: null,
    preferences: {
      notifications: true,
      newsletter: true,
      smsAlerts: false,
      twoFactorAuth: false
    }
  });

  // Historial de pedidos simulado
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2025-001',
      date: '2025-03-10',
      status: 'Entregado',
      total: 349.97,
      items: [
        { id: 7, name: 'Martillo Profesional', quantity: 2, price: 29.99 },
        { id: 8, name: 'Sierra Circular', quantity: 1, price: 189.99 },
        { id: 9, name: 'Juego de Destornilladores', quantity: 2, price: 49.99 }
      ]
    },
    {
      id: 'ORD-2025-002',
      date: '2025-02-24',
      status: 'Procesando',
      total: 112.95,
      items: [
        { id: 10, name: 'Cemento Multiusos', quantity: 3, price: 15.99 },
        { id: 12, name: 'Casco de Seguridad', quantity: 1, price: 22.99 },
        { id: 7, name: 'Martillo Profesional', quantity: 1, price: 29.99 }
      ]
    },
    {
      id: 'ORD-2025-003',
      date: '2025-01-15',
      status: 'Cancelado',
      total: 129.99,
      items: [
        { id: 11, name: 'Escalera Plegable', quantity: 1, price: 129.99 }
      ]
    }
  ]);

  // Direcciones guardadas
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Casa',
      fullName: 'Juan Pérez',
      street: 'Calle Principal 123',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28001',
      country: 'España',
      phone: '+34 612 345 678',
      isDefault: true
    },
    {
      id: 2,
      title: 'Oficina',
      fullName: 'Juan Pérez',
      street: 'Avenida de los Negocios 45, Planta 3',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28003',
      country: 'España',
      phone: '+34 912 345 678',
      isDefault: false
    }
  ]);

  // Métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      name: 'Visa terminada en 4321',
      last4: '4321',
      expiry: '05/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal',
      email: 'juan.perez@ejemplo.com',
      isDefault: false
    }
  ]);

  // Reseñas del usuario
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: 8,
      productName: 'Sierra Circular',
      rating: 4,
      comment: 'Excelente sierra, potente y precisa. Recomendada para trabajos profesionales.',
      date: '2025-03-12'
    },
    {
      id: 2,
      productId: 7,
      productName: 'Martillo Profesional',
      rating: 5,
      comment: 'El mejor martillo que he usado, equilibrado y con buen agarre.',
      date: '2025-03-11'
    }
  ]);

  // Estado para edición de datos
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Estado para nueva dirección
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'España',
    phone: '',
    isDefault: false
  });

  // Estado para edición de direcciones
  const [editAddressId, setEditAddressId] = useState(null);
  const [editAddressData, setEditAddressData] = useState(null);

  // Estado para mostrar detalles del pedido
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Manejar cambios en los inputs de datos personales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar cambios en las preferencias
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        [name]: checked
      }
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prevState => ({
          ...prevState,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Guardar cambios de datos personales
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  // Manejar cambios en nueva dirección
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambios en dirección que se edita
  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Guardar nueva dirección
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newId = Math.max(...addresses.map(addr => addr.id), 0) + 1;
    
    if (newAddress.isDefault) {
      // Si la nueva dirección es predeterminada, actualizar las demás
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      setAddresses([...updatedAddresses, { ...newAddress, id: newId }]);
    } else {
      setAddresses([...addresses, { ...newAddress, id: newId }]);
    }
    
    setIsAddingAddress(false);
    setNewAddress({
      title: '',
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'España',
      phone: '',
      isDefault: false
    });
  };

  // Iniciar edición de dirección
  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    setEditAddressId(addressId);
    setEditAddressData({ ...addressToEdit });
  };

  // Guardar cambios en dirección editada
  const handleSaveEditedAddress = (e) => {
    e.preventDefault();
    
    if (editAddressData.isDefault) {
      // Si la dirección editada es predeterminada, actualizar las demás
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editAddressId ? true : false
      }));
      setAddresses(updatedAddresses);
    } else {
      // Asegurarse de que al menos una dirección sea predeterminada
      const currentDefaultExists = addresses.some(addr => addr.id !== editAddressId && addr.isDefault);
      
      if (!currentDefaultExists && addresses.find(addr => addr.id === editAddressId).isDefault) {
        // Si estamos quitando la marca de predeterminada a la única que la tiene
        alert('Debe haber al menos una dirección predeterminada');
        return;
      }
      
      setAddresses(addresses.map(addr => 
        addr.id === editAddressId ? editAddressData : addr
      ));
    }
    
    setEditAddressId(null);
    setEditAddressData(null);
  };

  // Cancelar edición de dirección
  const handleCancelEditAddress = () => {
    setEditAddressId(null);
    setEditAddressData(null);
  };

  // Eliminar dirección
  const handleDeleteAddress = (addressId) => {
    // Verificar si es la dirección predeterminada
    const isDefault = addresses.find(addr => addr.id === addressId).isDefault;
    
    if (isDefault && addresses.length > 1) {
      alert('No se puede eliminar la dirección predeterminada. Por favor, establezca otra dirección como predeterminada primero.');
      return;
    }
    
    if (addresses.length === 1) {
      alert('Debe mantener al menos una dirección.');
      return;
    }
    
    if (window.confirm('¿Está seguro de que desea eliminar esta dirección?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    }
  };

  // Establecer dirección como predeterminada
  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  // Establecer método de pago como predeterminado
  const handleSetDefaultPayment = (paymentId) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === paymentId
    })));
  };

  // Eliminar método de pago
  const handleDeletePayment = (paymentId) => {
    // Verificar si es el método predeterminado
    const isDefault = paymentMethods.find(method => method.id === paymentId).isDefault;
    
    if (isDefault && paymentMethods.length > 1) {
      alert('No se puede eliminar el método de pago predeterminado. Por favor, establezca otro método como predeterminado primero.');
      return;
    }
    
    if (paymentMethods.length === 1) {
      alert('Debe mantener al menos un método de pago.');
      return;
    }
    
    if (window.confirm('¿Está seguro de que desea eliminar este método de pago?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== paymentId));
    }
  };

  // Ver detalles de un pedido
  const handleViewOrder = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    setSelectedOrder(order);
  };

  // Cerrar detalles del pedido
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Cerrar sesión
  const handleLogout = () => {
    // Aquí se implementaría la lógica real de cierre de sesión
    // Por ahora, solo redirigimos al inicio
    clearCart(); // Limpiar carrito al cerrar sesión
    navigate('/');
  };

  // Renderizar estrellas para reseñas
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <div className="profile-image-container">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="Perfil" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <span>{userData.fullName.charAt(0)}</span>
              </div>
            )}
          </div>
          <h2 className="user-name">{userData.fullName}</h2>
          <p className="user-email">{userData.email}</p>
        </div>
        
        <nav className="profile-nav">
          <ul>
            <li className={activeTab === 'personal' ? 'active' : ''}>
              <button onClick={() => setActiveTab('personal')}>
                <i className="nav-icon">👤</i> Datos Personales
              </button>
            </li>
            <li className={activeTab === 'orders' ? 'active' : ''}>
              <button onClick={() => setActiveTab('orders')}>
                <i className="nav-icon">📦</i> Mis Pedidos
              </button>
            </li>
            <li className={activeTab === 'addresses' ? 'active' : ''}>
              <button onClick={() => setActiveTab('addresses')}>
                <i className="nav-icon">📍</i> Direcciones
              </button>
            </li>
            <li className={activeTab === 'payments' ? 'active' : ''}>
              <button onClick={() => setActiveTab('payments')}>
                <i className="nav-icon">💳</i> Métodos de Pago
              </button>
            </li>
            <li className={activeTab === 'reviews' ? 'active' : ''}>
              <button onClick={() => setActiveTab('reviews')}>
                <i className="nav-icon">⭐</i> Mis Reseñas
              </button>
            </li>
            <li className={activeTab === 'security' ? 'active' : ''}>
              <button onClick={() => setActiveTab('security')}>
                <i className="nav-icon">🔒</i> Seguridad
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="nav-icon">🚪</i> Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="content-header">
          <h1>Mi Perfil</h1>
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link> &gt; <Link to="/catalog">Productos</Link> &gt; Mi Perfil
          </nav>
        </div>
        
        <div className="tab-content">
          {/* Pestaña de Datos Personales */}
          {activeTab === 'personal' && (
            <div className="personal-info-tab">
              <div className="section-header">
                <h2>Información Personal</h2>
                {!isEditing && (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Editar
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-image-section">
                    <div className="image-upload">
                      <label htmlFor="profile-image-input">
                        <div className="profile-image-edit">
                          {formData.profileImage ? (
                            <img src={formData.profileImage} alt="Perfil" />
                          ) : (
                            <div className="profile-placeholder large">
                              <span>{formData.fullName.charAt(0)}</span>
                            </div>
                          )}
                          <div className="image-overlay">
                            <span>Cambiar</span>
                          </div>
                        </div>
                      </label>
                      <input 
                        id="profile-image-input" 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre completo</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Correo electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Fecha de nacimiento</label>
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Empresa</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>NIF/CIF</label>
                      <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Dirección</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Biografía / Descripción</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="preferences-section">
                    <h3>Preferencias de comunicación</h3>
                    <div className="preferences-grid">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={formData.preferences.notifications}
                          onChange={handlePreferenceChange}
                        />
                        Recibir notificaciones
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.preferences.newsletter}
                          onChange={handlePreferenceChange}
                        />
                        Suscribirse al boletín
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="smsAlerts"
                          checked={formData.preferences.smsAlerts}
                          onChange={handlePreferenceChange}
                        />
                        Alertas por SMS
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                      Cancelar
                    </button>
                    <button type="submit" className="save-btn">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-display">
                  <div className="info-section">
                    <h3>Datos básicos</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Nombre</span>
                        <span className="info-value">{userData.fullName}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{userData.email}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{userData.phone}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Fecha de nacimiento</span>
                        <span className="info-value">{userData.birthday}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">Dirección</span>
                        <span className="info-value">{userData.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3>Datos profesionales</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Empresa</span>
                        <span className="info-value">{userData.company}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">NIF/CIF</span>
                        <span className="info-value">{userData.taxId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3>Biografía</h3>
                    <p className="bio-text">{userData.bio}</p>
                  </div>
                  
                  <div className="info-section">
                    <h3>Preferencias de comunicación</h3>
                    <div className="preferences-display">
                      <span className={`preference-badge ${userData.preferences.notifications ? 'active' : 'inactive'}`}>
                        {userData.preferences.notifications ? '✓' : '✗'} Notificaciones
                      </span>
                      
                      <span className={`preference-badge ${userData.preferences.newsletter ? 'active' : 'inactive'}`}>
                        {userData.preferences.newsletter ? '✓' : '✗'} Boletín
                      </span>
                      
                      <span className={`preference-badge ${userData.preferences.smsAlerts ? 'active' : 'inactive'}`}>
                        {userData.preferences.smsAlerts ? '✓' : '✗'} Alertas SMS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Pedidos */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="section-header">
                <h2>Historial de Pedidos</h2>
              </div>
              
              {orders.length > 0 ? (
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
                      key={order.id} 
                      className={`order-item ${selectedOrder && selectedOrder.id === order.id ? 'selected' : ''}`}
                    >
                      <div className="order-id">{order.id}</div>
                      <div className="order-date">{order.date}</div>
                      <div className={`order-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </div>
                      <div className="order-total">${order.total.toFixed(2)}</div>
                      <div className="order-actions">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No hay pedidos todavía</h3>
                  <p>Parece que aún no has realizado ninguna compra.</p>
                  <Link to="/catalog" className="action-btn">Explorar Productos</Link>
                </div>
              )}
              
              {/* Modal de detalles del pedido */}
              {selectedOrder && (
                <div className="order-details-modal">
                  <div className="modal-header">
                    <h3>Detalles del Pedido {selectedOrder.id}</h3>
                    <button 
                      className="close-btn"
                      onClick={handleCloseOrderDetails}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="order-info">
                    <div className="info-row">
                      <span>Fecha:</span>
                      <span>{selectedOrder.date}</span>
                    </div>
                    <div className="info-row">
                      <span>Estado:</span>
                      <span className={`status-${selectedOrder.status.toLowerCase()}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    <h4>Productos</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={`${selectedOrder.id}-${item.id}`}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row subtotal">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row shipping">
                      <span>Envío:</span>
                      <span>Gratis</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions-footer">
                    {selectedOrder.status === 'Procesando' && (
                      <button className="cancel-order-btn">Cancelar Pedido</button>
                    )}
                    <button className="track-order-btn">Seguir Pedido</button>
                    <button className="reorder-btn">Volver a Comprar</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Direcciones */}
          {activeTab === 'addresses' && (
            <div className="addresses-tab">
              <div className="section-header">
                <h2>Mis Direcciones</h2>
                <button 
                  className="add-btn"
                  onClick={() => setIsAddingAddress(true)}
                >
                  Añadir Nueva
                </button>
              </div>
              
              {addresses.length > 0 ? (
                <div className="addresses-grid">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-card ${address.isDefault ? 'default' : ''}`}
                    >
                      {address.isDefault && (
                        <div className="default-badge">Predeterminada</div>
                      )}
                      
                      <h3>{address.title}</h3>
                      <div className="address-details">
                        <p>{address.fullName}</p>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p>{address.phone}</p>
                      </div>
                      
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            className="set-default-btn"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Establecer como predeterminada
                          </button>
                        )}
                        <div className="action-buttons">
                          <button 
                            className="edit-btn-sm"
                            onClick={() => handleEditAddress(address.id)}
                          >
                            Editar
                          </button>
                          <button 
                            className="delete-btn-sm"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <h3>No hay direcciones guardadas</h3>
                  <p>Añade una dirección para facilitar tus futuras compras.</p>
                  <button 
                    className="action-btn"
                    onClick={() => setIsAddingAddress(true)}
                  >
                    Añadir Dirección
                  </button>
                </div>
              )}
              
              {/* Formulario para añadir nueva dirección */}
              {isAddingAddress && (
                <div className="address-form-modal">
                  <div className="modal-header">
                    <h3>Añadir Nueva Dirección</h3>
                    <button 
                      className="close-btn"
                      onClick={() => setIsAddingAddress(false)}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveAddress} className="address-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Título</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Ej. Casa, Oficina"
                          value={newAddress.title}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                          type="text"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Calle y número</label>
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Ciudad</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Provincia/Estado</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Código Postal</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={newAddress.zipCode}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>País</label>
                        <select
                          name="country"
                          value={newAddress.country}
                          onChange={handleAddressChange}
                          required
                        >
                          <option value="España">España</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Francia">Francia</option>
                          <option value="Italia">Italia</option>
                          <option value="Alemania">Alemania</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Teléfono</label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={newAddress.isDefault}
                            onChange={handleAddressChange}
                          />
                          Establecer como dirección predeterminada
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => setIsAddingAddress(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="save-btn">
                        Guardar Dirección
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Formulario para editar dirección */}
              {editAddressId !== null && editAddressData && (
                <div className="address-form-modal">
                  <div className="modal-header">
                    <h3>Editar Dirección</h3>
                    <button 
                      className="close-btn"
                      onClick={handleCancelEditAddress}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveEditedAddress} className="address-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Título</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Ej. Casa, Oficina"
                          value={editAddressData.title}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                          type="text"
                          name="fullName"
                          value={editAddressData.fullName}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Calle y número</label>
                        <input
                          type="text"
                          name="street"
                          value={editAddressData.street}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Ciudad</label>
                        <input
                          type="text"
                          name="city"
                          value={editAddressData.city}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Provincia/Estado</label>
                        <input
                          type="text"
                          name="state"
                          value={editAddressData.state}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Código Postal</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={editAddressData.zipCode}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>País</label>
                        <select
                          name="country"
                          value={editAddressData.country}
                          onChange={handleEditAddressChange}
                          required
                        >
                          <option value="España">España</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Francia">Francia</option>
                          <option value="Italia">Italia</option>
                          <option value="Alemania">Alemania</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Teléfono</label>
                        <input
                          type="tel"
                          name="phone"
                          value={editAddressData.phone}
                          onChange={handleEditAddressChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group full-width checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={editAddressData.isDefault}
                            onChange={handleEditAddressChange}
                          />
                          Establecer como dirección predeterminada
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={handleCancelEditAddress}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="save-btn">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Métodos de Pago */}
          {activeTab === 'payments' && (
            <div className="payments-tab">
              <div className="section-header">
                <h2>Métodos de Pago</h2>
                <button className="add-btn">Añadir Nuevo</button>
              </div>
              
              <div className="payments-grid">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id} 
                    className={`payment-card ${method.isDefault ? 'default' : ''}`}
                  >
                    {method.isDefault && (
                      <div className="default-badge">Predeterminado</div>
                    )}
                    
                    <div className="payment-icon">
                      {method.type === 'credit_card' ? '💳' : '🔄'}
                    </div>
                    
                    <div className="payment-details">
                      <h3>{method.name}</h3>
                      {method.type === 'credit_card' && (
                        <p>Expira: {method.expiry}</p>
                      )}
                      {method.type === 'paypal' && (
                        <p>{method.email}</p>
                      )}
                    </div>
                    
                    <div className="payment-actions">
                      {!method.isDefault && (
                        <button 
                          className="set-default-btn"
                          onClick={() => handleSetDefaultPayment(method.id)}
                        >
                          Establecer como predeterminado
                        </button>
                      )}
                      <div className="action-buttons">
                        <button className="edit-btn-sm">Editar</button>
                        <button 
                          className="delete-btn-sm"
                          onClick={() => handleDeletePayment(method.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="payment-info">
                <div className="info-icon">ℹ️</div>
                <p>
                  Tus datos de pago se almacenan de forma segura. Nunca compartiremos 
                  tu información con terceros sin tu consentimiento.
                </p>
              </div>
            </div>
          )}
          
          {/* Pestaña de Reseñas */}
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="section-header">
                <h2>Mis Reseñas</h2>
              </div>
              
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <h3>{review.productName}</h3>
                        <span className="review-date">{review.date}</span>
                      </div>
                      
                      <div className="rating">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="review-comment">{review.comment}</p>
                      
                      <div className="review-actions">
                        <button className="edit-review-btn">Editar</button>
                        <button className="delete-review-btn">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">⭐</div>
                  <h3>No has escrito reseñas todavía</h3>
                  <p>Comparte tu opinión sobre los productos que has comprado.</p>
                  <Link to="/catalog" className="action-btn">Ver Productos</Link>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Seguridad */}
          {activeTab === 'security' && (
            <div className="security-tab">
              <div className="section-header">
                <h2>Seguridad de la Cuenta</h2>
              </div>
              
              <div className="security-section">
                <h3>Cambiar Contraseña</h3>
                <form className="security-form">
                  <div className="form-group">
                    <label>Contraseña actual</label>
                    <input type="password" name="currentPassword" />
                  </div>
                  
                  <div className="form-group">
                    <label>Nueva contraseña</label>
                    <input type="password" name="newPassword" />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirmar nueva contraseña</label>
                    <input type="password" name="confirmPassword" />
                  </div>
                  
                  <button type="submit" className="save-btn">
                    Actualizar Contraseña
                  </button>
                </form>
              </div>
              
              <div className="security-section">
                <h3>Autenticación de Dos Factores</h3>
                <div className="two-factor-toggle">
                  <span>Estado: {userData.preferences.twoFactorAuth ? 'Activado' : 'Desactivado'}</span>
                  <button className={`toggle-btn ${userData.preferences.twoFactorAuth ? 'active' : ''}`}>
                    {userData.preferences.twoFactorAuth ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
                <p className="info-text">
                  La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta 
                  solicitando un código adicional además de tu contraseña cuando inicies sesión.
                </p>
              </div>
              
              <div className="security-section">
                <h3>Sesiones Activas</h3>
                <div className="session-card">
                  <div className="session-icon">💻</div>
                  <div className="session-details">
                    <h4>Este Dispositivo</h4>
                    <p>Madrid, España</p>
                    <p>Última actividad: Hoy, 15:45</p>
                  </div>
                  <button className="session-btn current">Dispositivo Actual</button>
                </div>
                
                <div className="session-card">
                  <div className="session-icon">📱</div>
                  <div className="session-details">
                    <h4>iPhone de Juan</h4>
                    <p>Madrid, España</p>
                    <p>Última actividad: Ayer, 19:20</p>
                  </div>
                  <button className="session-btn logout">Cerrar Sesión</button>
                </div>
              </div>
              
              <div className="security-section danger-zone">
                <h3>Zona Peligrosa</h3>
                <div className="danger-actions">
                  <div className="danger-action">
                    <div>
                      <h4>Descargar Mis Datos</h4>
                      <p>Obtén una copia de todos tus datos personales y actividad.</p>
                    </div>
                    <button className="download-btn">Descargar</button>
                  </div>
                  
                  <div className="danger-action">
                    <div>
                      <h4>Eliminar Cuenta</h4>
                      <p>Eliminar permanentemente tu cuenta y todos tus datos.</p>
                    </div>
                    <button className="delete-account-btn">Eliminar Cuenta</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;