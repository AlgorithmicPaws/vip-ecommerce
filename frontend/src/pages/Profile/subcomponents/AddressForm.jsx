import React from 'react';

const AddressForm = ({ title, address, onChange, onSave, onCancel }) => {
  return (
    <div className="address-form-modal">
      <div className="modal-header">
        <h3>{title}</h3>
        <button 
          className="close-btn"
          onClick={onCancel}
        >
          &times;
        </button>
      </div>
      
      <form onSubmit={onSave} className="address-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              placeholder="Ej. Casa, Oficina"
              value={address.title}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group full-width">
            <label>Calle y número</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Provincia/Estado</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>País</label>
            <select
              name="country"
              value={address.country}
              onChange={onChange}
              required
            >
              <option value="España">España</option>
              <option value="Portugal">Portugal</option>
              <option value="Francia">Francia</option>
              <option value="Italia">Italia</option>
              <option value="Alemania">Alemania</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group full-width checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={onChange}
              />
              Establecer como dirección predeterminada
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button type="submit" className="save-btn">
            Guardar Dirección
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;