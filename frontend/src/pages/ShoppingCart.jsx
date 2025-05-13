// src/pages/ShoppingCart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import '../styles/ShoppingCart.css'; // Styles for this page
import '../styles/CheckoutForm.css'; // Styles for the checkout form part

// Import Layout Components if not already handled by routing
// import Navbar from '../layouts/Navbar';
// import Footer from '../layouts/Footer';

// Import Child Components
import CartEmpty from './ShoppingCart/CartEmpty';
import CheckoutForm from './ShoppingCart/CheckoutForm'; // The form component

// Services (if needed for order creation logic)
import * as orderService from '../services/orderService';
import * as pdfService from '../services/pdfService'; // If generating PDF invoice
import * as emailService from '../services/emailService'; // If sending email confirmation

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isAuthenticated, user } = useAuth(); // Get auth state and user info

  // Checkout process states
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Flag to show checkout form
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for order submission
  const [orderComplete, setOrderComplete] = useState(false); // Flag for successful order
  const [orderId, setOrderId] = useState(null); // Store the created order ID
  const [orderError, setOrderError] = useState(null); // Store any errors during order creation
  const [orderDataForConfirmation, setOrderDataForConfirmation] = useState(null); // Store full order data for confirmation page/email

  // Helper function to format prices (ensure consistency)
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '$ 0'; // Default for invalid input
    try {
      return numPrice.toLocaleString('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0, minimumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error formatting price:', error);
      return '$ ' + Math.round(numPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  };

  // Calculate totals
  const subtotal = totalPrice;
  // Example shipping cost - adjust as needed
  const shippingCost = subtotal > 0 ? 15000 : 0; // Example: 15,000 COP shipping
  const totalWithShipping = subtotal + shippingCost;

  // Check if cart is empty
  const isEmpty = cartItems.length === 0;

  // Handle quantity change in the cart view
  const handleQuantityChange = (productId, newQuantity) => {
    // Find the item to check its stock
    const item = cartItems.find(item => item.id === productId);
    if (!item) return;

    // Ensure quantity is at least 1 and not more than stock
    const validatedQuantity = Math.max(1, Math.min(newQuantity, item.stock || 1)); // Default stock to 1 if undefined

    if (!isNaN(validatedQuantity)) {
        updateQuantity(productId, validatedQuantity);
    }
  };

  // Proceed to checkout view
  const handleProceedToCheckout = () => {
    if (isEmpty) return;
    if (!isAuthenticated) {
      // Redirect to login, passing the intent to return to checkout
      navigate('/login', { state: { from: { pathname: '/cart', isCheckout: true } } });
      return;
    }
    setIsCheckingOut(true); // Show the checkout form
    window.scrollTo(0, 0); // Scroll to top
  };

  // Handle checkout form submission
  const handleCheckoutSubmit = async (formData) => {
    if (isEmpty || !isAuthenticated) return; // Double-check

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Prepare order data for the API
      const apiOrderData = {
        items: cartItems.map(item => ({
          product_id: parseInt(item.id, 10),
          quantity: parseInt(item.quantity, 10),
          price_per_unit: parseFloat(item.price) // Use the price stored in the cart item
        })),
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country
        },
        billing_address: !formData.sameAsShipping ? {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          zip_code: formData.billingZipCode,
          country: formData.billingCountry
        } : null, // Send null if same as shipping
        payment_method: "bank_transfer", // Hardcoded as per requirement
        notes: formData.orderNotes || '',
        // The backend should calculate subtotal, shipping, total based on items and rules
      };

      // Call the order creation service
      const createdOrder = await orderService.createOrder(apiOrderData);

      // Store order details for confirmation display/email/PDF
      setOrderId(createdOrder.order_id);
      setOrderDataForConfirmation({
          ...createdOrder, // Include all data returned by the API
          // Explicitly add calculated values if needed for confirmation display
          subtotal: subtotal,
          shipping_cost: shippingCost,
          total_amount: totalWithShipping, // Use frontend calculated total for confirmation display
          items: cartItems.map(item => ({ // Use cart item details for confirmation
              ...item,
              price_per_unit: item.price,
              total_price: item.price * item.quantity
          })),
          shipping_address: apiOrderData.shipping_address // Ensure address is included
      });


      // --- Post-Order Actions (Optional: Email/PDF) ---
      // You might move this logic to a separate confirmation page
      // or trigger it based on the 'orderComplete' state.
      try {
          const pdfBlob = await pdfService.generateOrderInvoice(createdOrder); // Generate PDF
          await emailService.sendOrderConfirmationEmail(createdOrder, user.email, pdfBlob); // Send email with PDF
      } catch (postOrderError) {
          console.error("Error sending confirmation email/PDF:", postOrderError);
          // Don't block the UI for this, maybe log it or show a minor warning
      }
      // --- End Post-Order Actions ---


      clearCart(); // Clear the cart in the context/localStorage
      setOrderComplete(true); // Set flag to show confirmation message
      window.scrollTo(0, 0); // Scroll to top

    } catch (error) {
      console.error('Error processing order:', error);
      let errorMessage = 'Ha ocurrido un error al procesar el pedido. Por favor, inténtalo de nuevo.';
      // Try to get more specific error detail from the API response
      if (error.response?.data?.detail) {
        errorMessage = `Error: ${error.response.data.detail}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      setOrderError(errorMessage); // Display error to the user
    } finally {
      setIsSubmitting(false); // Stop loading indicator
    }
  };

  // --- Render Logic ---

  // Render Order Confirmation Screen
  if (orderComplete && orderDataForConfirmation) {
    return (
      <div className="page-container cart-container">
        {/* <Navbar /> */}
        <div className="page-content cart-content">
          <div className="order-confirmation">
            <div className="order-confirmation-icon">✅</div>
            <h2>¡Tu pedido ha sido confirmado!</h2>
            <p>Gracias por tu compra en VIP Market.</p>
            <p>Número de pedido: <span className="order-number">#{orderId}</span></p>

            {/* Display Order Summary */}
            <div className="order-summary-box confirmation-summary">
              <h3>Resumen del pedido</h3>
              <div className="order-totals">
                 <div className="total-row">
                   <span>Subtotal</span>
                   <span>{formatPrice(orderDataForConfirmation.subtotal)}</span>
                 </div>
                 <div className="total-row">
                    <span>Envío</span>
                    <span>{formatPrice(orderDataForConfirmation.shipping_cost)}</span>
                 </div>
                 <div className="total-row grand-total">
                   <span>Total</span>
                   <span>{formatPrice(orderDataForConfirmation.total_amount)}</span>
                 </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="payment-instructions">
              <h3>Instrucciones de pago</h3>
              <p>Para completar tu pedido, por favor realiza una transferencia bancaria con los siguientes datos:</p>
              <div className="bank-details">
                <p><strong>Banco:</strong> Bancolombia</p>
                <p><strong>Titular:</strong> VIP Market Colombia S.A.S</p>
                <p><strong>Cuenta Corriente Nº:</strong> 69812345678</p>
                <p><strong>Concepto:</strong> Pedido #{orderId}</p>
                <p><strong>Importe:</strong> {formatPrice(orderDataForConfirmation.total_amount)}</p>
              </div>
              <p>Una vez realizada la transferencia, envíanos el comprobante a <strong>pedidos@vipmarket.com.co</strong></p>
              <p>Tu pedido será procesado en cuanto confirmemos el pago.</p>
            </div>

            {/* Action Buttons */}
            <div className="order-actions confirmation-actions">
              <Link to="/orders" className="view-orders-btn primary-btn">
                Ver Mis Pedidos
              </Link>
              <Link to="/catalog" className="continue-shopping-btn secondary-btn">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  // Render Cart or Checkout View
  return (
    <div className="page-container cart-container">
      {/* <Navbar /> */}
      <div className="page-content cart-content">
        {isCheckingOut ? (
          // --- Checkout View ---
          <>
            <h1>Finalizar Compra</h1>
            {/* Display errors during checkout submission */}
            {orderError && (
              <div className="error-message api-error">
                {orderError}
              </div>
            )}
            <div className="checkout-grid">
              {/* Checkout Form Component */}
              <CheckoutForm
                onSubmit={handleCheckoutSubmit}
                isSubmitting={isSubmitting} // Pass loading state to disable form
              />

              {/* Order Summary Sidebar */}
              <div className="order-summary-sidebar">
                <div className="order-summary-box">
                  <h2>Resumen del Pedido</h2>
                  {/* List items in summary */}
                  <div className="order-items-summary">
                    {cartItems.map(item => (
                      <div key={item.id} className="summary-item">
                        <span className="summary-item-name">
                          {item.name} <span className="summary-item-qty">x{item.quantity}</span>
                        </span>
                        <span className="summary-item-price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Totals */}
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>Envío</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total</span>
                      <span>{formatPrice(totalWithShipping)}</span>
                    </div>
                  </div>
                  {/* Payment Method Info */}
                  <div className="payment-notice">
                    <p><strong>Forma de pago:</strong> Transferencia bancaria</p>
                    <p>Recibirás los datos bancarios al confirmar el pedido.</p>
                  </div>
                   {/* Back to Cart Button */}
                   <div className="back-to-cart">
                      <button onClick={() => setIsCheckingOut(false)} className="back-btn secondary-btn" disabled={isSubmitting}>
                        Volver al carrito
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // --- Cart View ---
          <>
            <h1>Tu Carrito de Compras</h1>
            {isEmpty ? (
              <CartEmpty />
            ) : (
              <div className="cart-grid">
                {/* Cart Items List */}
                <div className="cart-items-container">
                  {/* Header Row for Cart Items */}
                  <div className="cart-header-row">
                    <span className="header-product">Producto</span>
                    <span className="header-price">Precio Unit.</span>
                    <span className="header-quantity">Cantidad</span>
                    <span className="header-total">Subtotal</span>
                    <span className="header-actions"></span> {/* For remove button */}
                  </div>
                  {/* Individual Cart Items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      {/* Product Info */}
                      <div className="item-product">
                        <div className="item-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="image-placeholder">
                              <span>{item.name ? item.name.charAt(0) : '?'}</span>
                            </div>
                          )}
                        </div>
                        <div className="item-details">
                          {/* Link to product detail page */}
                          <Link to={`/catalog/product/${item.id}`} className="item-name-link">
                            {item.name}
                          </Link>
                          <p className="item-seller">
                            Vendido por: {item.seller || "VIP Market"}
                          </p>
                          {/* Low stock warning */}
                          {item.stock !== undefined && item.stock < 10 && item.stock > 0 && (
                            <p className="stock-warning">¡Solo quedan {item.stock}!</p>
                          )}
                           {item.stock === 0 && (
                             <p className="stock-out">Agotado</p>
                           )}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="item-price">{formatPrice(item.price)}</div>
                      {/* Quantity Controls */}
                      <div className="item-quantity">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Disminuir cantidad"
                          >-</button>
                          <input
                            type="number" // Use text to prevent spinners if needed, but handle validation
                            min="1"
                            max={item.stock || undefined} // Set max based on stock
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            aria-label={`Cantidad para ${item.name}`}
                            className="quantity-input"
                          />
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Aumentar cantidad"
                          >+</button>
                        </div>
                      </div>
                      {/* Subtotal */}
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {/* Remove Button */}
                      <div className="item-actions">
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Eliminar ${item.name} del carrito`}
                        >
                          &times; {/* Use times symbol for remove */}
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Actions below the items list */}
                  <div className="cart-list-actions">
                    <button className="clear-cart-btn secondary-btn" onClick={clearCart}>
                      Vaciar Carrito
                    </button>
                    <Link to="/catalog" className="continue-shopping-btn secondary-btn">
                      Seguir Comprando
                    </Link>
                  </div>
                </div>

                {/* Cart Summary Sidebar */}
                <div className="cart-summary-sidebar">
                   <div className="order-summary-box">
                      <h2>Resumen del Pedido</h2>
                      <div className="order-totals">
                         <div className="total-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                         </div>
                         <div className="total-row">
                            <span>Envío Estimado</span>
                            <span>{formatPrice(shippingCost)}</span>
                         </div>
                         <div className="total-row grand-total">
                            <span>Total Estimado</span>
                            <span>{formatPrice(totalWithShipping)}</span>
                         </div>
                      </div>
                      <div className="payment-notice">
                          <p><strong>Forma de pago:</strong> Transferencia bancaria</p>
                          <p>Los gastos de envío finales se calcularán en la página de pago.</p>
                      </div>
                      <button
                        className="checkout-btn primary-btn" // Use primary style
                        onClick={handleProceedToCheckout}
                        disabled={isEmpty} // Disable if cart is empty
                      >
                        Finalizar Compra
                      </button>
                   </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ShoppingCart;
