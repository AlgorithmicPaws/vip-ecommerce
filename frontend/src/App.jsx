import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./pages/CartContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import SellerRegistration from "./pages/SellerRegistration";
import BrandsPage from "./pages/Brands/BrandsPage";
import BrandCatalogPage from "./pages/Brands/BrandCatalogPage";
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
            
            {/* Ruta para registro de vendedores */}
            <Route path="/sell" element={<SellerRegistration />} />
            
            {/* Nuevas rutas para marcas */}
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/brands/:brandId" element={<BrandCatalogPage />} />
            
            {/* Redirección en caso de rutas no encontradas */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;