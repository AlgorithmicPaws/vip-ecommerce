import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/ShoppingCart.css';
import '../styles/CheckoutForm.css';

// Components
import CartHeader from './ShoppingCart/CartHeader';
import CartEmpty from './ShoppingCart/CartEmpty';
import CheckoutForm from './ShoppingCart/CheckoutForm';

// Services
import * as orderService from '../services/orderService';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  // Checkout process states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Helper function to format prices safely
  const formatPrice = (price) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number before using toFixed
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Verify authentication for checkout
  useEffect(() => {
    if (isCheckingOut && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart', isCheckout: true } } });
    }
  }, [isCheckingOut, isAuthenticated, navigate]);

  // Handle applying coupon
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'constru20') {
      setCouponApplied(true);
      setDiscount(totalPrice * 0.2); // 20% discount
    } else {
      alert('Cupón no válido');
    }
  };

  // Calculate totals
  const subtotal = totalPrice;
  const shippingCost = subtotal > 0 ? 12000 : 0; // Shipping cost in Colombian Pesos
  const totalWithDiscount = subtotal - discount + shippingCost;

  // Check if cart is empty
  const isEmpty = cartItems.length === 0;

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Proceed to checkout
  const handleProceedToCheckout = () => {
    if (isEmpty) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart', isCheckout: true } } });
      return;
    }
    
    setIsCheckingOut(true);
  };

  // Handle checkout form submission - SIMPLIFIED VERSION WITHOUT PDF/EMAIL
  const handleCheckoutSubmit = async (formData) => {
    if (isEmpty) return;
    
    setIsSubmitting(true);
    setOrderError(null);
    
    try {
      // Prepare order data
      const apiData = {
        // Format the items with correct data types
        items: cartItems.map(item => ({
          product_id: parseInt(item.id, 10),
          quantity: parseInt(item.quantity, 10),
          price_per_unit: parseFloat(item.price)
        })),
        
        // Format shipping address
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country
        },
        
        // Add billing address if different
        billing_address: !formData.sameAsShipping ? {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          zip_code: formData.billingZipCode,
          country: formData.billingCountry
        } : null,
        
        // Ensure payment_method matches the enum value exactly
        payment_method: "bank_transfer",
        
        // Add notes
        notes: formData.orderNotes || ''
      };
      
      // Log what we're sending for debugging
      console.log('Sending order data:', JSON.stringify(apiData, null, 2));
      
      // Send to backend API
      const response = await orderService.createOrder(apiData);
      
      console.log('Order created successfully:', response);
      
      // Set order data
      setOrderId(response.order_id);
      setOrderData(response);
      
      // Clear cart and complete order
      clearCart();
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Error processing order:', error);
      
      // Provide specific error message if available
      let errorMessage = 'Ha ocurrido un error al procesar el pedido. Por favor, inténtalo de nuevo.';
      
      if (error.response?.data?.detail) {
        errorMessage = `Error: ${error.response.data.detail}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setOrderError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render order confirmation - SIMPLIFIED VERSION WITHOUT PDF/EMAIL
  if (orderComplete) {
    return (
      <div className="cart-container">
        <CartHeader />
        
        <div className="cart-content">
          <div className="order-confirmation">
            <div className="order-confirmation-icon">✅</div>
            <h2>¡Tu pedido ha sido confirmado!</h2>
            <p>Gracias por tu compra en ConstructMarket.</p>
            
            <p>Número de pedido: <span className="order-number">{orderId}</span></p>
            
            <div className="order-summary">
              <h3>Resumen del pedido</h3>
              <p><strong>Total:</strong> ${formatPrice(totalWithDiscount)}</p>
              <p><strong>Método de pago:</strong> Transferencia bancaria</p>
            </div>
            
            <div className="payment-instructions">
              <h3>Instrucciones de pago</h3>
              <p>Para completar tu pedido, por favor realiza una transferencia bancaria con los siguientes datos:</p>
              <div className="bank-details">
                <p><strong>Banco:</strong> Bancolombia</p>
                <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
                <p><strong>Cuenta Corriente Nº:</strong> 69812345678</p>
                <p><strong>Concepto:</strong> Pedido {orderId}</p>
                <p><strong>Importe:</strong> ${formatPrice(totalWithDiscount)}</p>
              </div>
              <p>Una vez realizada la transferencia, envíanos el comprobante a <strong>pedidos@constructmarket.com.co</strong></p>
              <p>Tu pedido será procesado en cuanto confirmemos el pago.</p>
            </div>
            
            <div className="order-actions">
              <Link to="/orders" className="view-orders-btn">
                Ver Mis Pedidos
              </Link>
              <Link to="/catalog" className="continue-shopping-btn">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
        
        <footer className="cart-footer">
          <p>&copy; {new Date().getFullYear()} ConstructMarket Colombia S.A.S. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <CartHeader />

      <div className="cart-content">
        {isCheckingOut ? (
          <>
            <h1>Completar Compra</h1>
            {orderError && (
              <div className="error-message" style={{ padding: '10px', margin: '0 0 20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
                {orderError}
              </div>
            )}
            <div className="checkout-grid">
              <CheckoutForm 
                onSubmit={handleCheckoutSubmit}
                isSubmitting={isSubmitting}
              />
              
              <div className="order-summary-sidebar">
                <div className="order-summary-box">
                  <h2>Resumen del Pedido</h2>
                  
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-name">
                          {item.name} <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <div className="item-price">
                          ${formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${formatPrice(subtotal)}</span>
                    </div>
                    
                    {couponApplied && (
                      <div className="total-row discount">
                        <span>Descuento</span>
                        <span>-${formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="total-row">
                      <span>Envío</span>
                      <span>${formatPrice(shippingCost)}</span>
                    </div>
                    
                    <div className="total-row grand-total">
                      <span>Total</span>
                      <span>${formatPrice(totalWithDiscount)}</span>
                    </div>
                  </div>
                  
                  <div className="payment-notice">
                    <p><strong>Forma de pago:</strong> Transferencia bancaria</p>
                    <p>Recibirás los datos bancarios al confirmar el pedido.</p>
                  </div>
                  
                  <div className="back-to-cart">
                    <button onClick={() => setIsCheckingOut(false)} className="back-btn">
                      Volver al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>Tu Carrito de Compras</h1>
            
            {isEmpty ? (
              <CartEmpty />
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
                          <p className="item-seller">
                            Vendido por: {item.seller || "ConstructMarket"}
                          </p>
                          {item.stock < 10 && (
                            <p className="stock-warning">¡Solo quedan {item.stock} unidades!</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="item-price">${formatPrice(item.price)}</div>
                      
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
                      
                      <div className="item-total">
                        ${formatPrice(item.price * item.quantity)}
                      </div>
                      
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
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="summary-row discount">
                      <span>Descuento (Cupón)</span>
                      <span>-${formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Envío</span>
                    <span>${formatPrice(shippingCost)}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${formatPrice(totalWithDiscount)}</span>
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
                  
                  <div className="payment-info-box">
                    <p><strong>Forma de pago:</strong> Transferencia bancaria</p>
                    <p>Al realizar el pedido recibirás los datos bancarios.</p>
                  </div>
                  
                  <button 
                    className="checkout-btn"
                    onClick={handleProceedToCheckout}
                    disabled={isEmpty}
                  >
                    Proceder a Finalizar Pedido
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <footer className="cart-footer">
        <p>&copy; {new Date().getFullYear()} ConstructMarket Colombia S.A.S. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default ShoppingCart;