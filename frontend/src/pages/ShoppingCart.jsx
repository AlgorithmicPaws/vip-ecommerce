import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/ShoppingCart.css';
import CartHeader from './ShoppingCart/CartHeader';
import CartItems from './ShoppingCart/CartItems';
import CartActions from './ShoppingCart/CartActions';
import CartSummaryRow from './ShoppingCart/CartSummaryRow';
import CartEmpty from './ShoppingCart/CartEmpty';
import CartCouponSection from './ShoppingCart/CartCouponSection';
import CartSummaryRowDisc from './ShoppingCart/CartSummaryRowDisc';
const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Manejar aplicación de cupón (simulado)
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'constru20') {
      setCouponApplied(true);
      setDiscount(totalPrice * 0.2); // 20% de descuento
    } else {
      alert('Cupón no válido');
    }
  };

  // Calcular totales
  const subtotal = totalPrice;
  const shippingCost = subtotal > 0 ? 12.99 : 0;
  const totalWithDiscount = subtotal - discount + shippingCost;

  // Verificar si hay items en el carrito
  const isEmpty = cartItems.length === 0;

  // Manejar cambio de cantidad del producto
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Navegar a checkout (simulado)
  const handleCheckout = () => {
    alert('Procesando pedido...');
    // Aquí iría la lógica para dirigir a la página de pago
    // navigate('/checkout');
  };

  return (
    <div className="cart-container">
      
      {/*Seccion de header*/}
      <CartHeader/>

      <div className="cart-content">
        <h1>Tu Carrito de Compras</h1>
        
        {isEmpty ? (
          <CartEmpty/>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <div className="cart-header-row">
                <span className="header-product">Producto</span>
                <span className="header-price">Precio</span>
                <span className="header-quantity">Cantidad</span>
                <span className="header-total">Total</span>
                <span className="header-actions"></span>
              </div>
              
              {/*Seccion de los items del carrito*/}
              {cartItems.map((item) => (
                <CartItems item={item}/>
              ))}
              
              {/*Seccion de CartActions */}
              <CartActions clearCart={clearCart}/>

            </div>
            
            <div className="cart-summary">
              <h2>Resumen del Pedido</h2>
              
              <CartSummaryRow subtotal={subtotal}/>
              
              {couponApplied && (
                <CartSummaryRowDisc/>
              )}
          
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalWithDiscount.toFixed(2)}</span>
              </div>
              
              {/*Seccion de cupones en el carrito*/}
              <CartCouponSection couponCode={couponCode} setCouponCode={setCouponCode} handleApplyCoupon={handleApplyCoupon}/>
              
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isEmpty}
              >
                Proceder al Pago
              </button>
              
              <div className="payment-methods">
                <p>Métodos de pago aceptados:</p>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="cart-footer">
        <p>&copy; 2025 ConstructMarket. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default ShoppingCart;