import React from "react";
import FormField from "../subcomponents/FormField";
import FileUploadField from "../subcomponents/FileUploadField";

const CommonInfoForm = ({ data, errors, onChange, onPersonTypeChange }) => {
  return (
    <div className="common-info-form">
      <h2>Información de la tienda</h2>

      <FormField
        label="Nombre de la tienda en ConstructMarket *"
        name="storeName"
        value={data.storeName || ""}
        error={errors.storeName}
        onChange={(e) => onChange("storeName", e.target.value)}
        placeholder="Ej. Herramientas Profesionales S.A."
      />

      <FormField
        label="Descripción de la tienda en ConstrcutMarket *"
        name="storeDescription"
        value={data.storeDescription || ""}
        error={errors.storeDescription}
        onChange={(e) => onChange("storeDescription", e.target.value)}
        placeholder="Ej. Venta de Herramientas Profesionales y mucho mas."
      />

      <FormField
        label="Teléfono de contacto *"
        name="storePhone"
        type="tel"
        value={data.storePhone || ""}
        error={errors.storePhone}
        onChange={(e) => onChange("storePhone", e.target.value)}
        placeholder="Ej. 3123456789"
      />

      <FileUploadField
        label="Logo de la tienda"
        name="storeLogo"
        accept="image/*"
        error={errors.storeLogo}
        onChange={(file) => onChange("storeLogo", file)}
        description="Sube una imagen en formato JPG, PNG o SVG (máx. 2MB)"
      />

      <div className="person-type-selection">
        <p className="field-label">Tipo de persona *</p>
        <div className="radio-group">
          <label
            className={`radio-option ${
              data.personType === "business" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="personType"
              value="business"
              checked={data.personType === "business"}
              onChange={() => onPersonTypeChange("business")}
            />
            <div className="radio-content">
              <span className="radio-icon">🏢</span>
              <div className="radio-text">
                <span className="radio-title">Persona Jurídica</span>
                <span className="radio-description">
                  Empresa constituida legalmente
                </span>
              </div>
            </div>
          </label>

          <label
            className={`radio-option ${
              data.personType === "personal" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="personType"
              value="personal"
              checked={data.personType === "personal"}
              onChange={() => onPersonTypeChange("personal")}
            />
            <div className="radio-content">
              <span className="radio-icon">👤</span>
              <div className="radio-text">
                <span className="radio-title">Persona Natural</span>
                <span className="radio-description">Autónomo o particular</span>
              </div>
            </div>
          </label>
        </div>
        {errors.personType && (
          <p className="field-error">{errors.personType}</p>
        )}
      </div>

      <div className="form-info-note">
        <p>* Campos obligatorios</p>
        <p>
          <strong>Nota:</strong> En la siguiente pantalla solicitaremos la
          documentación
          {data.personType === "business"
            ? " legal de tu empresa."
            : " personal necesaria."}
        </p>
      </div>
    </div>
  );
};

export default CommonInfoForm;
