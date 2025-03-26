import React from 'react';
import PaymentMethodCard from '../subcomponents/PaymentMethodCard';

const PaymentsTab = ({ paymentMethods, setPaymentMethods }) => {
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

  return (
    <div className="payments-tab">
      <div className="section-header">
        <h2>Métodos de Pago</h2>
        <button className="add-btn">Añadir Nuevo</button>
      </div>
      
      <div className="payments-grid">
        {paymentMethods.map(method => (
          <PaymentMethodCard 
            key={method.id}
            paymentMethod={method}
            onSetDefault={() => handleSetDefaultPayment(method.id)}
            onDelete={() => handleDeletePayment(method.id)}
          />
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
  );
};

export default PaymentsTab;