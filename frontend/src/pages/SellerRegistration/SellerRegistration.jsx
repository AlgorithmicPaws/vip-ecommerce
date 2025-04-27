import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerRegistrationForm from './components/SellerRegistrationForm';
import ProgressSteps from './components/ProgressSteps';
import '../../styles/SellerRegistration.css';
import { post } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // We'll use logout to clear current session
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const totalSteps = 3;

  // Estado para almacenar todos los datos del formulario
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
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

  const handleSubmit = async (data) => {
    setFormData({...formData, ...data});
  
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      try {
        setIsSubmitting(true);
        setError(null);
  
        const postData = {
          business_name: formData.storeName,
          business_description: formData.storeDescription || "",
          id_type: formData.documentType || formData.personType,
          number_id: formData.documentNumber || formData.nit || "12345678"
        };
  
        console.log("Datos a enviar:", postData);
  
        // Register as seller
        await post('/sellers/', postData);
        setFormSubmitted(true);
        
        // Set a flag in localStorage to indicate seller registration success
        localStorage.setItem('just_registered_as_seller', 'true');
        
        // After a short delay to show the success message, redirect to login
        setTimeout(() => {
          // First logout the current user - this clears the token
          logout();
          
          // Redirect to login page
          navigate("/login");
        }, 3000);
        
      } catch (error) {
        console.error("Error detallado:", error.response?.data || error.message);
        setError("Error al registrar. Verifica los datos e intenta nuevamente.");
      } finally {
        setIsSubmitting(false);
      }
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

      {error && <div className="error-message">{error}</div>}
      {isSubmitting && <div className="loading-indicator">Enviando...</div>}

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
          <h2>¡Registro de vendedor exitoso!</h2>
          <p>Hemos recibido tu solicitud correctamente. Para acceder a las funciones de vendedor, necesitas iniciar sesión nuevamente.</p>
          <p>Serás redirigido a la página de inicio de sesión en unos segundos...</p>
        </div>
      )}
    </div>
  );
};

export default SellerRegistration;