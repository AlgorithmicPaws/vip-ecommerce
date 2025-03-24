import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./pages/CartContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";
import ProductCatalog from "./pages/ProductCatalog"; // Importación actualizada
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <CartProvider>
      <Router>
      <ScrollToTop />
        <div className="app">
          <Routes>
            {/* Página de inicio */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas para autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Ruta para el perfil de usuario */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Rutas para productos */}
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/catalog/product/:productId" element={<ProductDetail />} />
            
            {/* Ruta para el carrito */}
            <Route path="/cart" element={<ShoppingCart />} />
            
            {/* Redirección en caso de rutas no encontradas */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;