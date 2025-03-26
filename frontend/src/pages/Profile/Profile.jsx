import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/Profile.css';

// Importamos los componentes principales
import ProfileSidebar from './components/ProfileSidebar';
import ProfileContent from './components/ProfileContent';

// Datos de usuario simulados - en una aplicación real vendría de una API/backend
const mockUserData = {
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
};

// Historial de pedidos simulado
const mockOrders = [
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
];

// Direcciones guardadas
const mockAddresses = [
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
];

// Métodos de pago
const mockPaymentMethods = [
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
];

// Reseñas del usuario
const mockReviews = [
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
];

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Estado para controlar pestaña activa
  const [activeTab, setActiveTab] = useState('personal');
  
  // Estados para el perfil del usuario
  const [userData, setUserData] = useState(mockUserData);
  const [orders, setOrders] = useState(mockOrders);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [reviews, setReviews] = useState(mockReviews);
  
  // Estado para el modal de detalles del pedido
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cerrar sesión
  const handleLogout = () => {
    // Aquí se implementaría la lógica real de cierre de sesión
    clearCart(); // Limpiar carrito al cerrar sesión
    navigate('/');
  };

  return (
    <div className="profile-container">
      <ProfileSidebar 
        userData={userData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <ProfileContent 
        activeTab={activeTab}
        userData={userData}
        setUserData={setUserData}
        orders={orders}
        setOrders={setOrders}
        addresses={addresses}
        setAddresses={setAddresses}
        paymentMethods={paymentMethods}
        setPaymentMethods={setPaymentMethods}
        reviews={reviews}
        setReviews={setReviews}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </div>
  );
};

export default Profile;