import React from 'react';
import FormField from '../subcomponents/FormField';
import FileUploadField from '../subcomponents/FileUploadField';

const BusinessInfoForm = ({ data, errors, onChange }) => {
  // Opciones para tipo de contribuyente
  const taxpayerOptions = [
    { value: '', label: 'Selecciona una opción' },
    { value: 'regimen-comun', label: 'Régimen Común' },
    { value: 'gran-contribuyente', label: 'Gran Contribuyente' },
    { value: 'regimen-simplificado', label: 'Régimen Simplificado' },
    { value: 'responsable-iva', label: 'Responsable de IVA' },
    { value: 'no-responsable-iva', label: 'No Responsable de IVA' }
  ];

  return (
    <div className="business-info-form">
      <h2>Información de Persona Jurídica</h2>
      
      <div className="form-group">
        <label className="field-label">Tipo de contribuyente *</label>
        <select
          name="taxpayerType"
          value={data.taxpayerType || ''}
          onChange={(e) => onChange('taxpayerType', e.target.value)}
          className={`form-select ${errors.taxpayerType ? 'error' : ''}`}
        >
          {taxpayerOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.taxpayerType && <p className="field-error">{errors.taxpayerType}</p>}
      </div>
      
      <FormField
        label="Razón social *"
        name="businessName"
        value={data.businessName || ''}
        error={errors.businessName}
        onChange={(e) => onChange('businessName', e.target.value)}
        placeholder="Ej. Herramientas Profesionales S.A."
      />
      
      <div className="nit-container">
        <div className="nit-number">
          <FormField
            label="NIT *"
            name="nit"
            value={data.nit || ''}
            error={errors.nit}
            onChange={(e) => onChange('nit', e.target.value)}
            placeholder="Ej. 900123456"
          />
        </div>
        <div className="verification-digit">
          <FormField
            label="Dígito de verificación *"
            name="verificationDigit"
            value={data.verificationDigit || ''}
            error={errors.verificationDigit}
            onChange={(e) => onChange('verificationDigit', e.target.value)}
            placeholder="Ej. 7"
            maxLength={1}
          />
        </div>
      </div>
      
      <FileUploadField
        label="Certificado de RUT *"
        name="rutCertificate"
        accept=".pdf,.jpg,.jpeg,.png"
        error={errors.rutCertificate}
        onChange={(file) => onChange('rutCertificate', file)}
        description="Sube una imagen o PDF del certificado RUT (máx. 5MB)"
      />
      
      <FileUploadField
        label="Documento legal *"
        name="legalDocument"
        accept=".pdf,.jpg,.jpeg,.png"
        error={errors.legalDocument}
        onChange={(file) => onChange('legalDocument', file)}
        description="Sube una imagen o PDF de Cámara de Comercio o documento equivalente (máx. 5MB)"
      />
      
      <FileUploadField
        label="Cédula del representante legal *"
        name="legalRepresentativeId"
        accept=".pdf,.jpg,.jpeg,.png"
        error={errors.legalRepresentativeId}
        onChange={(file) => onChange('legalRepresentativeId', file)}
        description="Sube una imagen o PDF de la cédula del representante legal (máx. 5MB)"
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

export default BusinessInfoForm;