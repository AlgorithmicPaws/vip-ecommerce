import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./pages/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
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
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import PaymentConfirmation from "./pages/PaymentConfirmation/PaymentConfirmation";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Routes that use MainLayout (with Navbar and Footer) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/catalog/product/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:brandId" element={<BrandCatalogPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/sell" element={<SellerRegistration />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/orders/:orderId" element={<OrderDetail />} />
                  <Route path="/payment-confirmation/:orderId" element={<PaymentConfirmation />} />
                </Route>
                
                {/* Protected routes - require seller role */}
                <Route element={<ProtectedRoute requiredRole="seller" />}>
                  <Route path="/products" element={<ProductManagement />} />
                </Route>
              </Route>
              
              {/* Routes without MainLayout (login, register) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
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