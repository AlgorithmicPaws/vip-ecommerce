// src/pages/ShoppingCart/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Removed direct CSS import if styles are handled in ShoppingCart.css or a global file
// import '../../styles/CheckoutForm.css';

const CheckoutForm = ({ onSubmit, isSubmitting }) => {
  const { user } = useAuth(); // Get user info for pre-filling

  // Initialize form state, pre-filling with user data if available
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '', // Use phone from user context if available

    // Shipping address fields
    street: '',
    city: '',
    state: '', // Department/State
    zipCode: '',
    country: 'Colombia', // Default country

    // Billing address fields
    sameAsShipping: true, // Default to same address
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'Colombia',

    // Additional info
    orderNotes: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Pre-fill form when user data loads/changes (if user logs in during checkout)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.first_name || '',
        lastName: prev.lastName || user.last_name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        // You might want to pre-fill address parts if available in user profile
      }));
    }
  }, [user]);


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear the specific error when the user modifies the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios.';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio.';
    } else if (!/^\d{7,10}$/.test(formData.phone)) { // Basic Colombian phone validation (7-10 digits)
        newErrors.phone = 'Ingrese un número de teléfono válido (7-10 dígitos).';
    }

    // Shipping address validation
    if (!formData.street.trim()) newErrors.street = 'La dirección es obligatoria.';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria.';
    if (!formData.state.trim()) newErrors.state = 'El departamento es obligatorio.';
    if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'El código postal es obligatorio.';
    } else if (!/^\d{6}$/.test(formData.zipCode)) { // Basic 6-digit validation
        newErrors.zipCode = 'Ingrese un código postal válido (6 dígitos).';
    }


    // Billing address validation (only if different from shipping)
    if (!formData.sameAsShipping) {
      if (!formData.billingStreet.trim()) newErrors.billingStreet = 'La dirección de facturación es obligatoria.';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'La ciudad de facturación es obligatoria.';
      if (!formData.billingState.trim()) newErrors.billingState = 'El departamento de facturación es obligatorio.';
      if (!formData.billingZipCode.trim()) {
          newErrors.billingZipCode = 'El código postal de facturación es obligatorio.';
      } else if (!/^\d{6}$/.test(formData.billingZipCode)) {
          newErrors.billingZipCode = 'Ingrese un código postal de facturación válido (6 dígitos).';
      }
    }

    setErrors(newErrors); // Update the errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      // If valid, call the onSubmit prop passed from ShoppingCart
      onSubmit(formData); // Pass the validated form data
    } else {
      // Optionally scroll to the first error
      const firstErrorField = document.querySelector('.form-group .error-message');
      if (firstErrorField) {
          firstErrorField.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    // Use consistent container class if needed, or rely on parent styling
    <div className="checkout-form-container">
      <form onSubmit={handleSubmit} className="checkout-form" noValidate>

        {/* Personal Information Section */}
        <section className="checkout-section">
          <h2>Información de Contacto</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombres *</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'input-error' : ''} disabled={isSubmitting} required />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellidos *</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'input-error' : ''} disabled={isSubmitting} required />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} disabled={isSubmitting} required />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'input-error' : ''} placeholder="Ej: 3001234567" disabled={isSubmitting} required />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          </div>
        </section>

        {/* Shipping Address Section */}
        <section className="checkout-section">
          <h2>Dirección de Envío</h2>
          <div className="form-group">
            <label htmlFor="street">Dirección (Calle, número, apto) *</label>
            <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} className={errors.street ? 'input-error' : ''} placeholder="Ej: Calle 100 # 20-30 Apto 501" disabled={isSubmitting} required />
            {errors.street && <div className="error-message">{errors.street}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ciudad *</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} disabled={isSubmitting} required />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="state">Departamento *</label>
              <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className={errors.state ? 'input-error' : ''} disabled={isSubmitting} required />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
          </div>
          <div className="form-row">
             <div className="form-group">
               <label htmlFor="zipCode">Código Postal *</label>
               <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className={errors.zipCode ? 'input-error' : ''} placeholder="Ej: 110111" maxLength={6} disabled={isSubmitting} required />
               {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
             </div>
            <div className="form-group">
              <label htmlFor="country">País *</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} disabled={isSubmitting} required>
                <option value="Colombia">Colombia</option>
                {/* Add other countries if needed */}
              </select>
              {/* No error message needed for select with default */}
            </div>
          </div>
        </section>

        {/* Billing Address Section */}
        <section className="checkout-section">
          <h2>Dirección de Facturación</h2>
          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input type="checkbox" name="sameAsShipping" checked={formData.sameAsShipping} onChange={handleChange} disabled={isSubmitting} />
              <span className="checkbox-text">La misma que la dirección de envío</span>
            </label>
          </div>

          {/* Show billing fields only if checkbox is unchecked */}
          {!formData.sameAsShipping && (
            <>
              <div className="form-group">
                <label htmlFor="billingStreet">Dirección (Calle, número, apto) *</label>
                <input type="text" id="billingStreet" name="billingStreet" value={formData.billingStreet} onChange={handleChange} className={errors.billingStreet ? 'input-error' : ''} disabled={isSubmitting} required={!formData.sameAsShipping} />
                {errors.billingStreet && <div className="error-message">{errors.billingStreet}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingCity">Ciudad *</label>
                  <input type="text" id="billingCity" name="billingCity" value={formData.billingCity} onChange={handleChange} className={errors.billingCity ? 'input-error' : ''} disabled={isSubmitting} required={!formData.sameAsShipping} />
                  {errors.billingCity && <div className="error-message">{errors.billingCity}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="billingState">Departamento *</label>
                  <input type="text" id="billingState" name="billingState" value={formData.billingState} onChange={handleChange} className={errors.billingState ? 'input-error' : ''} disabled={isSubmitting} required={!formData.sameAsShipping} />
                  {errors.billingState && <div className="error-message">{errors.billingState}</div>}
                </div>
              </div>
               <div className="form-row">
                 <div className="form-group">
                   <label htmlFor="billingZipCode">Código Postal *</label>
                   <input type="text" id="billingZipCode" name="billingZipCode" value={formData.billingZipCode} onChange={handleChange} className={errors.billingZipCode ? 'input-error' : ''} placeholder="Ej: 110111" maxLength={6} disabled={isSubmitting} required={!formData.sameAsShipping}/>
                   {errors.billingZipCode && <div className="error-message">{errors.billingZipCode}</div>}
                 </div>
                <div className="form-group">
                  <label htmlFor="billingCountry">País *</label>
                  <select id="billingCountry" name="billingCountry" value={formData.billingCountry} onChange={handleChange} disabled={isSubmitting} required={!formData.sameAsShipping}>
                    <option value="Colombia">Colombia</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Order Notes Section */}
        <section className="checkout-section">
          <h2>Notas Adicionales (Opcional)</h2>
          <div className="form-group">
            <label htmlFor="orderNotes">Notas sobre tu pedido, ej. instrucciones especiales de entrega.</label>
            <textarea id="orderNotes" name="orderNotes" value={formData.orderNotes} onChange={handleChange} rows="3" disabled={isSubmitting} />
          </div>
        </section>

        {/* Submit Button Section */}
        <div className="form-actions checkout-actions">
           {/* Add Terms and Conditions Checkbox if needed */}
           {/* <div className="form-group checkbox-group terms-group">
              <label className="checkbox-container">
                <input type="checkbox" name="termsAccepted" required />
                <span className="checkbox-text">He leído y acepto los <Link to="/terms" target="_blank">términos y condiciones</Link> *</span>
              </label>
            </div> */}
          <button type="submit" className="place-order-btn primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando Pedido...' : 'Confirmar Pedido y Pagar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
