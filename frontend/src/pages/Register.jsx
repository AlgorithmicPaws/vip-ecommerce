import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css'; // Asegúrate que este CSS tenga los estilos para .error-message y .success-message

const Register = () => {
  const navigate = useNavigate();
  // Obtén la función register y el error global del contexto si existe
  const { register, isAuthenticated, error: globalAuthError } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  // Estado de la UI
  const [isLoading, setIsLoading] = useState(false);
  // Usaremos este estado para errores específicos de esta página/validación
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirigir si ya está autenticado
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

    // Limpiar error local cuando el usuario empieza a escribir
    if (localError) setLocalError('');
  };

  // --- VALIDACIÓN MEJORADA CON MENSAJES CLAROS ---
  const validateForm = () => {
    // Limpiar error previo
    setLocalError('');

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setLocalError('Por favor, completa todos los campos obligatorios (*).');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }

     if (password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden. Por favor, verifícalas.');
      return false;
    }

    // Si todo está bien
    return true;
  };
  // --- FIN VALIDACIÓN ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      return; // Detener si la validación falla
    }

    // Preparar datos para la API
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || null, // Enviar null si está vacío
      address: formData.address || null // Enviar null si está vacío
    };

    setIsLoading(true);
    setLocalError(''); // Limpiar error local
    setSuccessMessage(''); // Limpiar mensaje de éxito

    try {
      // Llamar a la función register del contexto
      await register(userData);

      // Mostrar mensaje de éxito
      setSuccessMessage('¡Registro exitoso! Serás redirigido al inicio de sesión.');

      // Resetear formulario (opcional, puedes dejarlo o no)
      // setFormData({ ... });

      // Redirigir a login después de un momento
      setTimeout(() => {
        navigate('/login');
      }, 2500); // Un poco más de tiempo para leer el mensaje

    } catch (err) {
      // --- MANEJO DE ERRORES MEJORADO ---
      const errorMessage = err.message || 'Ocurrió un error inesperado.';

      if (errorMessage.includes('already exists') || errorMessage.includes('409') || errorMessage.includes('duplicado')) {
         // Error específico para email existente
         setLocalError(`El correo electrónico "${formData.email}" ya está registrado. ¿Quizás querías <Link to="/login">iniciar sesión</Link>?`);
         // Nota: Para que el Link funcione dentro del error, necesitarías renderizar el error como HTML o usar una librería.
         // Alternativa simple: setLocalError(`El correo electrónico "${formData.email}" ya está registrado. Intenta iniciar sesión.`);
      } else if (errorMessage.includes('validation failed')) {
         // Error genérico de validación del backend (si lo hay)
         setLocalError('Hubo un problema con los datos enviados. Por favor, revisa el formulario.');
      }
      else {
        // Error genérico pero más informativo
        setLocalError('Hubo un error durante el registro. Por favor, inténtalo de nuevo más tarde.');
        console.error("Register error:", err); // Mantén el log para depuración
      }
       // --- FIN MANEJO DE ERRORES ---

    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar error local o el error global del AuthContext si existe
  const displayError = localError || globalAuthError;

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Crear Cuenta</h1>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Mensaje de error claro */}
        {displayError && (
          // Usar dangerouslySetInnerHTML si quieres renderizar el Link en el error (¡con precaución!)
          // <div className="error-message" dangerouslySetInnerHTML={{ __html: displayError }}></div>
          // O la versión simple:
           <div className="error-message">
             {displayError}
           </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Añadir etiquetas y marcar campos requeridos visualmente si es necesario */}
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
              required
              aria-describedby={displayError ? "reg-error" : undefined}
            />
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
              required
              aria-describedby={displayError ? "reg-error" : undefined}
            />
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
              required
              aria-describedby={displayError ? "reg-error" : undefined}
            />
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
              required
              aria-describedby={displayError ? "reg-error" : undefined}
            />
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
              required
              aria-describedby={displayError ? "reg-error" : undefined}
            />
          </div>
          {/* Añadido id al mensaje de error para aria-describedby */}
          {displayError && <p id="reg-error" className="sr-only">Error: {displayError}</p>}

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'} {/* Texto de carga más corto */}
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
