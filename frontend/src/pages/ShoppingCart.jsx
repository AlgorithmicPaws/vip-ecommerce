import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/ShoppingCart.css';

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
      <header className="cart-header">
        <div className="header-top">
          <div className="logo">
            <Link to="/">ConstructMarket</Link>
          </div>
          <div className="header-actions">
            <Link to="/catalog" className="back-to-store">Seguir Comprando</Link>
          </div>
        </div>
      </header>

      <div className="cart-content">
        <h1>Tu Carrito de Compras</h1>
        
        {isEmpty ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Parece que aún no has añadido productos a tu carrito.</p>
            <Link to="/catalog" className="continue-shopping-btn">Ver Productos</Link>
          </div>
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
              
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-product">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="image-placeholder">
                          <span>{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-seller">Vendido por: {item.seller || 'ConstructMax'}</p>
                      {item.stock < 10 && (
                        <p className="stock-warning">¡Solo quedan {item.stock} unidades!</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  
                  <div className="item-quantity">
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        max={item.stock} 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  
                  <div className="item-actions">
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Vaciar Carrito
                </button>
                <Link to="/catalog" className="continue-shopping-btn">
                  Seguir Comprando
                </Link>
              </div>
            </div>
            
            <div className="cart-summary">
              <h2>Resumen del Pedido</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {couponApplied && (
                <div className="summary-row discount">
                  <span>Descuento (Cupón)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Envío</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalWithDiscount.toFixed(2)}</span>
              </div>
              
              <div className="coupon-section">
                <h3>¿Tienes un Cupón?</h3>
                <div className="coupon-input">
                  <input 
                    type="text" 
                    placeholder="Código de descuento" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={handleApplyCoupon}>Aplicar</button>
                </div>
                <p className="coupon-hint">Prueba con: CONSTRU20</p>
              </div>
              
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