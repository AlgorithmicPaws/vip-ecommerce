import React from 'react';
import { Link } from 'react-router-dom';

// Importamos las pestañas
import PersonalInfoTab from '../tabs/PersonalInfoTab';
import OrdersTab from '../tabs/OrdersTab';
import AddressesTab from '../tabs/AddressesTab';
import PaymentsTab from '../tabs/PaymentsTab';
import ReviewsTab from '../tabs/ReviewsTab';
import SecurityTab from '../tabs/SecurityTab';

const ProfileContent = ({
  activeTab,
  userData,
  setUserData,
  orders,
  setOrders,
  addresses,
  setAddresses,
  paymentMethods,
  setPaymentMethods,
  reviews,
  setReviews,
  selectedOrder,
  setSelectedOrder
}) => {
  return (
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
          <PersonalInfoTab 
            userData={userData}
            setUserData={setUserData}
          />
        )}
        
        {/* Pestaña de Pedidos */}
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        )}
        
        {/* Pestaña de Direcciones */}
        {activeTab === 'addresses' && (
          <AddressesTab 
            addresses={addresses}
            setAddresses={setAddresses}
          />
        )}
        
        {/* Pestaña de Métodos de Pago */}
        {activeTab === 'payments' && (
          <PaymentsTab 
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
          />
        )}
        
        {/* Pestaña de Reseñas */}
        {activeTab === 'reviews' && (
          <ReviewsTab 
            reviews={reviews}
            setReviews={setReviews}
          />
        )}
        
        {/* Pestaña de Seguridad */}
        {activeTab === 'security' && (
          <SecurityTab 
            userData={userData}
            setUserData={setUserData}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileContent;