import React from 'react';

const ShippingForm = ({ shippingData, onChange }) => {
  return (
    <div className="shipping-form-container">
      <h2>Dirección de Envío</h2>
      
      <div className="form-description">
        <p>Por favor, complete la información de envío para su pedido.</p>
      </div>
      
      <form className="shipping-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={shippingData.fullName}
              onChange={onChange}
              required
              placeholder="Ej. Juan Pérez"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingData.email}
              onChange={onChange}
              required
              placeholder="Ej. juan.perez@email.com"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Dirección *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingData.address}
            onChange={onChange}
            required
            placeholder="Ej. Calle Principal 123, Piso 2"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Ciudad *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingData.city}
              onChange={onChange}
              required
              placeholder="Ej. Madrid"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">Provincia *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={shippingData.state}
              onChange={onChange}
              required
              placeholder="Ej. Madrid"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">Código Postal *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={shippingData.zipCode}
              onChange={onChange}
              required
              placeholder="Ej. 28001"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingData.phone}
              onChange={onChange}
              required
              placeholder="Ej. 600123456"
            />
          </div>
        </div>
        
        <div className="form-group checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="saveAddress"
              checked={shippingData.saveAddress}
              onChange={onChange}
            />
            Guardar esta dirección para futuros pedidos
          </label>
        </div>
        
        <div className="shipping-options">
          <h3>Opciones de Envío</h3>
          
          <div className="shipping-option">
            <label className="radio-label">
              <input
                type="radio"
                name="shippingOption"
                value="standard"
                defaultChecked
              />
              <div className="option-info">
                <div className="option-name">Envío Estándar</div>
                <div className="option-description">Entrega en 24-48h laborables</div>
                <div className="option-price">10.00€</div>
              </div>
            </label>
          </div>
          
          <div className="shipping-option">
            <label className="radio-label">
              <input
                type="radio"
                name="shippingOption"
                value="express"
              />
              <div className="option-info">
                <div className="option-name">Envío Express</div>
                <div className="option-description">Entrega en 24h garantizada</div>
                <div className="option-price">15.00€</div>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;