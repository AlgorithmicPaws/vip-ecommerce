import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas para autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta para el perfil de usuario */}
          <Route path="/profile" element={<Profile />} />

          {/* Ruta para la administración de productos */}
          <Route path="/products" element={<ProductManagement />} />
          
          {/* Redirección en caso de rutas no encontradas */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
