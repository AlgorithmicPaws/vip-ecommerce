import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./pages/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductManagement from "./pages/ProductManagement";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import SellerRegistration from "./pages/SellerRegistration";
import BrandsPage from "./pages/Brands/BrandsPage";
import BrandCatalogPage from "./pages/Brands/BrandCatalogPage";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/catalog/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:brandId" element={<BrandCatalogPage />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/sell" element={<SellerRegistration />} />
              </Route>
              
              {/* Protected routes - require seller role */}
              <Route element={<ProtectedRoute requiredRole="seller" />}>
                <Route path="/products" element={<ProductManagement />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
};

export default App;