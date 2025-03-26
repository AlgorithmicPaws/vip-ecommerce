import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerRegistrationForm from './components/SellerRegistrationForm';
import ProgressSteps from './components/ProgressSteps';
import '../../styles/SellerRegistration.css';

const SellerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const totalSteps = 3;

  // Estado para almacenar todos los datos del formulario
  const [formData, setFormData] = useState({
    storeName: '',
    storePhone: '',
    storeLogo: null,
    personType: 'business', // 'business' = Persona Jurídica, 'personal' = Persona Natural
    taxpayerType: '',
    businessName: '',
    nit: '',
    verificationDigit: '',
    rutCertificate: null,
    legalDocument: null,
    legalRepresentativeId: null,
    // Campos para persona natural
    firstName: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    personalRutCertificate: null
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (data) => {
    // Actualizar datos del formulario
    setFormData({...formData, ...data});
    
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      // Procesamiento final del formulario
      console.log('Formulario enviado:', formData);
      setFormSubmitted(true);
      
      // Aquí se enviarían los datos a la API
      // ...
    }
  };

  return (
    <div className="seller-registration-container">
      <div className="seller-registration-header">
        <Link to="/" className="home-link">
          <span className="header-icon">🏠</span> Volver al inicio
        </Link>
        <h1 className="registration-title">Registro de Vendedores</h1>
        <p className="registration-subtitle">
          ¡Empieza a vender tus productos en ConstructMarket y llega a miles de clientes!
        </p>
      </div>

      <ProgressSteps 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        steps={['Información de la tienda', 'Documentación legal', 'Confirmación']}
      />

      {!formSubmitted ? (
        <SellerRegistrationForm 
          currentStep={currentStep}
          formData={formData}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      ) : (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>¡Gracias por registrarte!</h2>
          <p>Hemos recibido tu solicitud y está siendo revisada. Te notificaremos cuando tu cuenta de vendedor esté lista.</p>
          <Link to="/" className="return-home-btn">Volver al inicio</Link>
        </div>
      )}
    </div>
  );
};

export default SellerRegistration;