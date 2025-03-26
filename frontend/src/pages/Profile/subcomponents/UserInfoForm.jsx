import React from 'react';

const UserInfoForm = ({ formData, onChange }) => {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Nombre completo</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group">
        <label>Fecha de nacimiento</label>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group">
        <label>Empresa</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group">
        <label>NIF/CIF</label>
        <input
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group full-width">
        <label>Dirección</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group full-width">
        <label>Biografía / Descripción</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={onChange}
          rows="3"
        ></textarea>
      </div>
    </div>
  );
};

export default UserInfoForm;