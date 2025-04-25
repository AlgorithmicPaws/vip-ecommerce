import React, { useState, useEffect } from 'react';
import CommonInfoForm from './CommonInfoForm';
import BusinessInfoForm from './BusinessInfoForm';
import PersonalInfoForm from './PersonalInfoForm';

const SellerRegistrationForm = ({ currentStep, formData, onSubmit, onPrevious }) => {
  const [stepData, setStepData] = useState({});
  const [errors, setErrors] = useState({});
  const [personType, setPersonType] = useState(formData.personType);

  // Actualizar datos de formulario cuando cambien desde el componente principal
  useEffect(() => {
    setStepData({ ...formData });
    setPersonType(formData.personType);
  }, [formData]);

  // Manejar cambio de tipo de persona (natural/jurídica)
  const handlePersonTypeChange = (type) => {
    setPersonType(type);
    setStepData(prev => ({ ...prev, personType: type }));
  };

  // Validar el formulario según el paso actual
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validación para el paso 1 (información común)
    if (currentStep === 1) {
      if (!stepData.storeName?.trim()) {
        newErrors.storeName = 'El nombre de la tienda es obligatorio';
        isValid = false;
      }
      if (!stepData.storePhone?.trim()) {
        newErrors.storePhone = 'El teléfono de contacto es obligatorio';
        isValid = false;
      } else if (!/^\d{7,10}$/.test(stepData.storePhone)) {
        newErrors.storePhone = 'Ingrese un número de teléfono válido';
        isValid = false;
      }
    }

    // Validación para el paso 2 (información específica según tipo de persona)
    if (currentStep === 2) {
      if (personType === 'business') {
        // Validación para persona jurídica
        if (!stepData.taxpayerType) {
          newErrors.taxpayerType = 'Seleccione un tipo de contribuyente';
          isValid = false;
        }
        if (!stepData.businessName?.trim()) {
          newErrors.businessName = 'La razón social es obligatoria';
          isValid = false;
        }
        if (!stepData.nit?.trim()) {
          newErrors.nit = 'El NIT es obligatorio';
          isValid = false;
        }
        if (!stepData.verificationDigit?.trim()) {
          newErrors.verificationDigit = 'El dígito de verificación es obligatorio';
          isValid = false;
        }
        if (!stepData.rutCertificate) {
          newErrors.rutCertificate = 'El certificado RUT es obligatorio';
          isValid = false;
        }
        if (!stepData.legalDocument) {
          newErrors.legalDocument = 'El documento legal es obligatorio';
          isValid = false;
        }
        if (!stepData.legalRepresentativeId) {
          newErrors.legalRepresentativeId = 'La cédula del representante legal es obligatoria';
          isValid = false;
        }
      } else {
        // Validación para persona natural
        if (!stepData.firstName?.trim()) {
          newErrors.firstName = 'El nombre es obligatorio';
          isValid = false;
        }
        if (!stepData.lastName?.trim()) {
          newErrors.lastName = 'Los apellidos son obligatorios';
          isValid = false;
        }
        if (!stepData.documentType) {
          newErrors.documentType = 'Seleccione un tipo de documento';
          isValid = false;
        }
        if (!stepData.documentNumber?.trim()) {
          newErrors.documentNumber = 'El número de documento es obligatorio';
          isValid = false;
        }
        if (!stepData.personalRutCertificate) {
          newErrors.personalRutCertificate = 'El certificado RUT es obligatorio';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    setStepData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(stepData);
    } else {
      // Desplazar a la posición del primer error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CommonInfoForm 
            data={stepData}
            errors={errors}
            onChange={handleChange}
            onPersonTypeChange={handlePersonTypeChange}
          />
        );
      case 2:
        return personType === 'business' ? (
          <BusinessInfoForm 
            data={stepData}
            errors={errors}
            onChange={handleChange}
          />
        ) : (
          <PersonalInfoForm 
            data={stepData}
            errors={errors}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <div className="confirmation-step">
            <h2>Confirmación de datos</h2>
            <div className="confirmation-details">
              <h3>Información de la tienda</h3>
              <p><strong>Nombre de la tienda:</strong> {stepData.storeName}</p>
              <p><strong>Teléfono:</strong> {stepData.storePhone}</p>
              <p><strong>Tipo de persona:</strong> {personType === 'business' ? 'Persona Jurídica' : 'Persona Natural'}</p>
              
              {personType === 'business' ? (
                <>
                  <h3>Información jurídica</h3>
                  <p><strong>Tipo de contribuyente:</strong> {stepData.taxpayerType}</p>
                  <p><strong>Razón social:</strong> {stepData.businessName}</p>
                  <p><strong>NIT:</strong> {stepData.nit}-{stepData.verificationDigit}</p>
                  <p><strong>Documentos:</strong> {stepData.rutCertificate?.name}, {stepData.legalDocument?.name}, {stepData.legalRepresentativeId?.name}</p>
                </>
              ) : (
                <>
                  <h3>Información personal</h3>
                  <p><strong>Nombres:</strong> {stepData.firstName}</p>
                  <p><strong>Apellidos:</strong> {stepData.lastName}</p>
                  <p><strong>Tipo de documento:</strong> {stepData.documentType}</p>
                  <p><strong>Número de documento:</strong> {stepData.documentNumber}</p>
                  <p><strong>Certificado RUT:</strong> {stepData.personalRutCertificate?.name}</p>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="seller-registration-form-container">
      <form onSubmit={handleSubmit} className="seller-form">
        {renderStepContent()}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="previous-btn"
              onClick={onPrevious}
            >
              Anterior
            </button>
          )}
          
          <button 
            type="submit" 
            className="next-btn"
          >
            {currentStep < 3 ? 'Siguiente' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerRegistrationForm;