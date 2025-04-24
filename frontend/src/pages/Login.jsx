import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css'; // Asegúrate que este CSS tenga los estilos para .error-message

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtén la función login y el error global (aunque no lo mostraremos directamente)
  const { login, isAuthenticated, error: globalAuthError } = useAuth();

  // Redirigir si viene de otra página
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  // Usaremos este estado para mostrar errores específicos de esta página/intento
  const [localError, setLocalError] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Limpiar error local cuando el usuario empieza a escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Siempre limpia el error local al escribir
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(''); // Limpiar error local antes de un nuevo intento

    try {
      const credentials = {
        email: formData.email,
        password: formData.password
      };

      // Llamar a la función login del contexto
      await login(credentials);

      // Si login es exitoso, el useEffect de arriba debería manejar la redirección

    } catch (err) {
      // --- MANEJO DE ERRORES MEJORADO ---
      const errorMessage = err.message || 'Ocurrió un error inesperado.';

      // Establecer el error LOCAL basado en la respuesta del intento actual
      // Incluye la verificación para 422
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('401') || errorMessage.includes('incorrect') || errorMessage.includes('422')) {
        setLocalError('El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos.');
      } else if (errorMessage.includes('User not found') || errorMessage.includes('404')) {
        setLocalError('No encontramos una cuenta asociada a ese correo electrónico.');
      } else {
        setLocalError('Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        console.error("Login error:", err); // Mantén el log para depuración
      }
      // --- FIN MANEJO DE ERRORES ---

    } finally {
      setIsLoading(false);
    }
  };

  // --- UPDATED: Display error logic ---
  // Mostrar SIEMPRE Y SÓLO el error local.
  const displayError = localError;
  // --- END UPDATE ---


  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>

        {/* Mostrar mensaje de error claro si existe */}
        {displayError && (
          <div className="error-message">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
             <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* El párrafo <p> para accesibilidad fue eliminado previamente */}

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
