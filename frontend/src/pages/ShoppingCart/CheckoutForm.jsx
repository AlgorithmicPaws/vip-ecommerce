import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/CheckoutForm.css';

const CheckoutForm = ({ onSubmit, isSubmitting }) => {
  const { user } = useAuth();
  
  // Initialize form with user info if available
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    
    // Shipping address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia',
    
    // Billing address
    sameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'Colombia',
    
    // Additional info
    orderNotes: ''
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkboxes, use the checked property
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Personal info validation
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    
    // Shipping address validation
    if (!formData.street.trim()) newErrors.street = 'La dirección es obligatoria';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (!formData.state.trim()) newErrors.state = 'El departamento es obligatorio';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es obligatorio';
    
    // Billing address validation (if not same as shipping)
    if (!formData.sameAsShipping) {
      if (!formData.billingStreet.trim()) newErrors.billingStreet = 'La dirección de facturación es obligatoria';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'La ciudad de facturación es obligatoria';
      if (!formData.billingState.trim()) newErrors.billingState = 'El departamento de facturación es obligatorio';
      if (!formData.billingZipCode.trim()) newErrors.billingZipCode = 'El código postal de facturación es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Set payment method to bank transfer by default
      const formDataWithPayment = {
        ...formData,
        paymentMethod: 'bank_transfer'
      };
      onSubmit(formDataWithPayment);
    }
  };

  return (
    <div className="checkout-form-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <section className="checkout-section">
          <h2>Información Personal</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Apellidos *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          </div>
        </section>
        
        <section className="checkout-section">
          <h2>Dirección de Envío</h2>
          
          <div className="form-group">
            <label htmlFor="street">Dirección *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={errors.street ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.street && <div className="error-message">{errors.street}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ciudad *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">Departamento *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">Código Postal *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="country">País *</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Colombia">Colombia</option>
              </select>
            </div>
          </div>
        </section>
        
        <section className="checkout-section">
          <h2>Dirección de Facturación</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="checkbox-text">Usar la misma dirección de envío</span>
            </label>
          </div>
          
          {!formData.sameAsShipping && (
            <>
              <div className="form-group">
                <label htmlFor="billingStreet">Dirección *</label>
                <input
                  type="text"
                  id="billingStreet"
                  name="billingStreet"
                  value={formData.billingStreet}
                  onChange={handleChange}
                  className={errors.billingStreet ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.billingStreet && <div className="error-message">{errors.billingStreet}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingCity">Ciudad *</label>
                  <input
                    type="text"
                    id="billingCity"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    className={errors.billingCity ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.billingCity && <div className="error-message">{errors.billingCity}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="billingState">Departamento *</label>
                  <input
                    type="text"
                    id="billingState"
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleChange}
                    className={errors.billingState ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.billingState && <div className="error-message">{errors.billingState}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingZipCode">Código Postal *</label>
                  <input
                    type="text"
                    id="billingZipCode"
                    name="billingZipCode"
                    value={formData.billingZipCode}
                    onChange={handleChange}
                    className={errors.billingZipCode ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.billingZipCode && <div className="error-message">{errors.billingZipCode}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="billingCountry">País *</label>
                  <select
                    id="billingCountry"
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="Colombia">Colombia</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </section>
        
        <section className="checkout-section">
          <h2>Método de Pago</h2>
          
          <div className="payment-info-box">
            <p><strong>Pago por Transferencia Bancaria</strong></p>
            <p>Una vez confirmado el pedido, recibirás un correo con los datos bancarios para realizar la transferencia.</p>
            <p>El pedido se procesará una vez recibido el pago.</p>
          </div>
        </section>
        
        <section className="checkout-section">
          <h2>Notas del Pedido</h2>
          
          <div className="form-group">
            <textarea
              id="orderNotes"
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Instrucciones especiales para tu pedido (opcional)"
              rows="3"
              disabled={isSubmitting}
            />
          </div>
        </section>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="place-order-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;