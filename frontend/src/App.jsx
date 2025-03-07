import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Redirige la ruta raíz al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Ruta para el login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta para el registro */}
          <Route path="/register" element={<Register />} />
          
          {/* Ruta para el perfil de usuario */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Ruta para manejar rutas no encontradas - redirige al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;