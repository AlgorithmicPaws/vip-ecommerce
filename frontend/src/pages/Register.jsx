import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: globalAuthError } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Field-specific errors for more granular error display
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the specific field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error when user makes changes
    if (localError) setLocalError('');
  };

  // Improved validation with field-specific errors
  const validateForm = () => {
    // Reset all errors
    setLocalError('');
    const newFieldErrors = {};
    let isValid = true;

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Check required fields
    if (!firstName.trim()) {
      newFieldErrors.firstName = 'El nombre es obligatorio';
      isValid = false;
    }

    if (!lastName.trim()) {
      newFieldErrors.lastName = 'El apellido es obligatorio';
      isValid = false;
    }

    if (!email.trim()) {
      newFieldErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newFieldErrors.email = 'Por favor, ingresa un correo electrónico válido';
        isValid = false;
      }
    }

    if (!password) {
      newFieldErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (password.length < 8) {
      newFieldErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      newFieldErrors.password = 'La contraseña debe contener al menos un número y una letra';
      isValid = false;
    }

    if (!confirmPassword) {
      newFieldErrors.confirmPassword = 'Debes confirmar tu contraseña';
      isValid = false;
    } else if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    // Prepare data for the API
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || null,
      address: formData.address || null
    };

    setIsLoading(true);
    setLocalError('');
    setSuccessMessage('');

    try {
      await register(userData);
      
      setSuccessMessage('¡Registro exitoso! Serás redirigido al inicio de sesión.');
      
      // Redirect to login after a moment
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Enhanced error handling
      console.error("Register error:", err);
      
      const errorMessage = err.message || '';
      
      // Check for specific error types and set appropriate messages
      if (errorMessage.includes('already exists') || errorMessage.includes('409') || errorMessage.includes('duplicado')) {
        setFieldErrors(prev => ({
          ...prev,
          email: `El correo electrónico "${formData.email}" ya está registrado.`
        }));
      } else if (errorMessage.includes('validation failed')) {
        setLocalError('Hubo un problema con los datos enviados. Por favor, revisa el formulario.');
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        setLocalError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        // Generic error message as fallback
        setLocalError(
          'No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde o contacta con soporte.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Combined error to display (global or local)
  const displayError = localError || globalAuthError;

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Crear Cuenta</h1>

        {/* Success message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* General error message */}
        {displayError && (
          <div className="error-message">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-firstName">Nombres *</label>
            <input
              id="reg-firstName"
              type="text"
              name="firstName"
              placeholder="Tus nombres"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className={fieldErrors.firstName ? "error-input" : ""}
              required
            />
            {fieldErrors.firstName && (
              <span className="field-error">{fieldErrors.firstName}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-lastName">Apellidos *</label>
            <input
              id="reg-lastName"
              type="text"
              name="lastName"
              placeholder="Tus apellidos"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className={fieldErrors.lastName ? "error-input" : ""}
              required
            />
            {fieldErrors.lastName && (
              <span className="field-error">{fieldErrors.lastName}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-email">Correo electrónico *</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={fieldErrors.email ? "error-input" : ""}
              required
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-phone">Teléfono (Opcional)</label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              placeholder="Tu número de teléfono"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-address">Dirección (Opcional)</label>
            <input
              id="reg-address"
              type="text"
              name="address"
              placeholder="Tu dirección"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-password">Contraseña *</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={fieldErrors.password ? "error-input" : ""}
              required
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-confirmPassword">Confirmar contraseña *</label>
            <input
              id="reg-confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={fieldErrors.confirmPassword ? "error-input" : ""}
              required
            />
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;