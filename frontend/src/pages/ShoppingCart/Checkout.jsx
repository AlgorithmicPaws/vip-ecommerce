import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import CheckoutSummary from './components/CheckoutSummary';
import ShippingForm from './components/ShippingForm';
import PaymentMethod from './components/PaymentMethod';
import OrderReview from './components/OrderReview';
import CheckoutSteps from './components/CheckoutSteps';
import '../../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  
  // Estado para controlar el paso actual del checkout
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado para datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    saveAddress: false
  });
  
  // Estado para método de pago - solo transferencia
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  
  // Estado para envío y descuentos
  const [shippingCost, setShippingCost] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  
  // Estado para procesamiento de la orden
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  // Verificar si hay items en el carrito
  useEffect(() => {
    if (cartItems.length === 0 && !orderCompleted) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderCompleted]);

  // Calcular totales
  const subtotal = totalPrice;
  const total = subtotal + shippingCost - discount;

  // Aplicar cupón
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'constru20') {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
    } else {
      setError('Cupón no válido');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Validar formulario de envío
  const validateShippingForm = () => {
    // Verificar campos requeridos
    if (!shippingData.fullName || !shippingData.email || !shippingData.address || 
        !shippingData.city || !shippingData.state || !shippingData.zipCode || !shippingData.phone) {
      setError('Por favor, complete todos los campos');
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.email)) {
      setError('Por favor, introduzca un email válido');
      return false;
    }
    
    // Validar teléfono
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(shippingData.phone.replace(/\D/g, ''))) {
      setError('Por favor, introduzca un número de teléfono válido');
      return false;
    }
    
    setError(null);
    return true;
  };

  // Avanzar al siguiente paso
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (validateShippingForm()) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      // No necesitamos validación adicional para transferencia
      setCurrentStep(3);
      window.scrollTo(0, 0);
    }
  };

  // Volver al paso anterior
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Procesar el pedido
  const processOrder = () => {
    setIsProcessing(true);
    
    // Simular procesamiento del pedido
    setTimeout(() => {
      try {
        // En una aplicación real, aquí iría la llamada a la API para crear el pedido
        const newOrderId = 'ORD-' + Date.now();
        setOrderId(newOrderId);
        setOrderCompleted(true);
        clearCart();
      } catch (err) {
        setError('Error al procesar el pedido. Por favor, intente de nuevo.');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  // Actualizar datos de envío
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="checkout-container">
      <Navbar />
      
      <div className="checkout-content">
        <h1 className="checkout-title">Finalizar Compra</h1>
        
        {!orderCompleted ? (
          <>
            <CheckoutSteps currentStep={currentStep} />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="checkout-grid">
              <div className="checkout-main">
                {currentStep === 1 && (
                  <ShippingForm
                    shippingData={shippingData}
                    onChange={handleShippingChange}
                  />
                )}
                
                {currentStep === 2 && (
                  <PaymentMethod 
                    paymentMethod={paymentMethod}
                  />
                )}
                
                {currentStep === 3 && (
                  <OrderReview
                    shippingData={shippingData}
                    paymentMethod={paymentMethod}
                    cartItems={cartItems}
                  />
                )}
                
                <div className="checkout-navigation">
                  {currentStep > 1 && (
                    <button 
                      className="back-btn"
                      onClick={goToPreviousStep}
                      disabled={isProcessing}
                    >
                      Volver
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button 
                      className="next-btn"
                      onClick={goToNextStep}
                      disabled={isProcessing}
                    >
                      Continuar
                    </button>
                  ) : (
                    <button 
                      className="place-order-btn"
                      onClick={processOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
                    </button>
                  )}
                </div>
              </div>
              
              <CheckoutSummary
                subtotal={subtotal}
                shippingCost={shippingCost}
                discount={discount}
                total={total}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponApplied={couponApplied}
                onApplyCoupon={handleApplyCoupon}
                cartItems={cartItems}
              />
            </div>
          </>
        ) : (
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h2>¡Pedido Completado!</h2>
            <p>Gracias por tu compra. Tu pedido ha sido recibido.</p>
            <div className="order-info">
              <p>Número de pedido: <strong>{orderId}</strong></p>
              <p>Recibirás un email de confirmación en <strong>{shippingData.email}</strong></p>
              <p>Por favor realiza la transferencia bancaria siguiendo las instrucciones enviadas a tu correo.</p>
            </div>
            <div className="success-actions">
              <Link to="/catalog" className="browse-more-btn">
                Seguir Comprando
              </Link>
              <Link to="/profile?tab=orders" className="view-order-btn">
                Ver mis Pedidos
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;