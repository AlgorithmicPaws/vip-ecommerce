import React from 'react';
import { Link } from 'react-router-dom';

// Importamos las pestañas
import PersonalInfoTab from '../tabs/PersonalInfoTab';
import OrdersTab from '../tabs/OrdersTab';

import SellerTab from '../tabs/SellerTab';
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
        <h1>
          {activeTab === 'personal' && 'Información Personal'}
          {activeTab === 'orders' && 'Mis Pedidos'}
          {activeTab === 'seller' && 'Perfil de Vendedor'}
          {activeTab === 'security' && 'Seguridad'}
        </h1>
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
            setOrders={setOrders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        )}
        

        
        {/* Pestaña de Perfil de Vendedor */}
        {activeTab === 'seller' && (
          <SellerTab 
            userData={userData}
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