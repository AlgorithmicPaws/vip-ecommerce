import React from 'react';
import FormField from '../subcomponents/FormField';
import FileUploadField from '../subcomponents/FileUploadField';

const PersonalInfoForm = ({ data, errors, onChange }) => {
  // Opciones para tipo de documento
  const documentTypeOptions = [
    { value: '', label: 'Selecciona una opción' },
    { value: 'cc', label: 'Cédula de Ciudadanía' },
    { value: 'ce', label: 'Cédula de Extranjería' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'ti', label: 'Tarjeta de Identidad' }
  ];

  return (
    <div className="personal-info-form">
      <h2>Información de Persona Natural</h2>
      
      <div className="name-container">
        <div className="first-name">
          <FormField
            label="Nombres *"
            name="firstName"
            value={data.firstName || ''}
            error={errors.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Ej. Juan Carlos"
          />
        </div>
        <div className="last-name">
          <FormField
            label="Apellidos *"
            name="lastName"
            value={data.lastName || ''}
            error={errors.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Ej. Rodríguez Pérez"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="field-label">Tipo de documento *</label>
        <select
          name="documentType"
          value={data.documentType || ''}
          onChange={(e) => onChange('documentType', e.target.value)}
          className={`form-select ${errors.documentType ? 'error' : ''}`}
        >
          {documentTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.documentType && <p className="field-error">{errors.documentType}</p>}
      </div>
      
      <FormField
        label="Número de documento *"
        name="documentNumber"
        value={data.documentNumber || ''}
        error={errors.documentNumber}
        onChange={(e) => onChange('documentNumber', e.target.value)}
        placeholder="Ej. 1023456789"
      />
      
      <FileUploadField
        label="Certificado de RUT *"
        name="personalRutCertificate"
        accept=".pdf,.jpg,.jpeg,.png"
        error={errors.personalRutCertificate}
        onChange={(file) => onChange('personalRutCertificate', file)}
        description="Sube una imagen o PDF del certificado RUT (máx. 5MB)"
      />
      
      <div className="form-info-note">
        <p>* Campos obligatorios</p>
        <p>
          <strong>Nota:</strong> Todos los documentos deben estar vigentes y ser legibles. 
          Tu solicitud será revisada por nuestro equipo antes de activar tu cuenta de vendedor.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;