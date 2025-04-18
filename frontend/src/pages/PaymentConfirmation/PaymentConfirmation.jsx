import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import '../../styles/PaymentConfirmation.css';

// Components
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import LoadingIndicator from '../ProductCatalog/subcomponents/LoadingIndicator';

const PaymentConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [paymentInfo, setPaymentInfo] = useState({
    payment_date: '',
    payment_reference: '',
    amount: '',
    payer_name: '',
    notes: ''
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch order details when component mounts
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/payment-confirmation/${orderId}` } } });
      return;
    }
    
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const orderData = await orderService.getOrderById(orderId);
        
        // Check if this order is eligible for payment confirmation
        if (orderData.payment_method !== 'bank_transfer' || 
            orderData.payment_status !== 'pending' ||
            orderData.order_status === 'cancelled') {
          throw new Error('Este pedido no es elegible para confirmación de pago');
        }
        
        setOrder(orderData);
        
        // Pre-fill amount field with order total
        setPaymentInfo(prev => ({
          ...prev,
          amount: orderData.total_amount.toString()
        }));
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        setError(err.message || 'No se pudo cargar el pedido. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for date comparison
    
    if (!paymentInfo.payment_date) {
      errors.payment_date = 'La fecha de pago es obligatoria';
    } else {
      const inputDate = new Date(paymentInfo.payment_date);
      inputDate.setHours(0, 0, 0, 0);
      
      if (inputDate > today) {
        errors.payment_date = 'La fecha de pago no puede ser en el futuro';
      }
    }
    
    if (!paymentInfo.payment_reference) {
      errors.payment_reference = 'La referencia de pago es obligatoria';
    }
    
    if (!paymentInfo.amount) {
      errors.amount = 'El monto del pago es obligatorio';
    } else if (isNaN(parseFloat(paymentInfo.amount)) || parseFloat(paymentInfo.amount) <= 0) {
      errors.amount = 'Ingrese un monto válido';
    } else if (order && parseFloat(paymentInfo.amount) !== parseFloat(order.total_amount)) {
      errors.amount = `El monto debe ser exactamente $${order.total_amount.toFixed(2)}`;
    }
    
    if (!paymentInfo.payer_name) {
      errors.payer_name = 'El nombre del pagador es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format data for API
      const receiptInfo = {
        payment_date: new Date(paymentInfo.payment_date).toISOString(),
        payment_reference: paymentInfo.payment_reference,
        amount: parseFloat(paymentInfo.amount),
        payer_name: paymentInfo.payer_name,
        notes: paymentInfo.notes
      };
      
      // Submit payment receipt to API
      await orderService.uploadPaymentReceipt(orderId, receiptInfo);
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting payment confirmation:', err);
      setError('Error al enviar la confirmación de pago. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Helper function to format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : price;
  };

  return (
    <div className="payment-confirmation-container">
      <Navbar />
      
      <div className="payment-confirmation-content">
        <div className="payment-confirmation-breadcrumbs">
          <Link to="/">Inicio</Link> &gt; 
          <Link to="/orders">Mis Pedidos</Link> &gt; 
          <Link to={`/orders/${orderId}`}>Pedido #{orderId}</Link> &gt; 
          <span>Confirmar Pago</span>
        </div>
        
        <h1>Confirmar Pago de Pedido #{orderId}</h1>
        
        {loading ? (
          <LoadingIndicator message="Cargando información del pedido..." />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()} 
                className="retry-btn"
              >
                Reintentar
              </button>
              <Link to={`/orders/${orderId}`} className="back-to-order-btn">
                Volver al Pedido
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Pago Confirmado!</h2>
            <p>Hemos recibido tu confirmación de pago. Nuestro equipo verificará los datos y actualizará el estado de tu pedido en breve.</p>
            <div className="success-actions">
              <Link to={`/orders/${orderId}`} className="view-order-btn">
                Ver Detalles del Pedido
              </Link>
              <Link to="/orders" className="back-to-orders-btn">
                Volver a Mis Pedidos
              </Link>
            </div>
          </div>
        ) : (
          <div className="payment-confirmation-form-container">
            <div className="bank-details-section">
              <h2>Datos Bancarios</h2>
              <p>Para completar tu pedido, realiza una transferencia con los siguientes datos:</p>
              
              <div className="bank-details">
                <div className="bank-detail-item">
                  <span className="detail-label">Banco:</span>
                  <span className="detail-value">Bancolombia</span>
                </div>
                <div className="bank-detail-item">
                  <span className="detail-label">Titular:</span>
                  <span className="detail-value">ConstructMarket Colombia S.A.S</span>
                </div>
                <div className="bank-detail-item">
                  <span className="detail-label">Cuenta Corriente:</span>
                  <span className="detail-value">69812345678</span>
                </div>
                <div className="bank-detail-item">
                  <span className="detail-label">Concepto:</span>
                  <span className="detail-value">Pedido {orderId}</span>
                </div>
                <div className="bank-detail-item">
                  <span className="detail-label">Importe:</span>
                  <span className="detail-value highlight">${formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
            
            <div className="confirmation-form-section">
              <h2>Confirmar Pago</h2>
              <p>Una vez realizada la transferencia, completa este formulario con los datos del pago:</p>
              
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="payment_date">Fecha de Pago *</label>
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    value={paymentInfo.payment_date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={formErrors.payment_date ? 'error' : ''}
                    disabled={submitting}
                    required
                  />
                  {formErrors.payment_date && <div className="error-text">{formErrors.payment_date}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="payment_reference">Referencia del Pago / Número de Comprobante *</label>
                  <input
                    type="text"
                    id="payment_reference"
                    name="payment_reference"
                    value={paymentInfo.payment_reference}
                    onChange={handleInputChange}
                    placeholder="Ej. 123456789"
                    className={formErrors.payment_reference ? 'error' : ''}
                    disabled={submitting}
                    required
                  />
                  {formErrors.payment_reference && <div className="error-text">{formErrors.payment_reference}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="amount">Monto del Pago ($) *</label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={paymentInfo.amount}
                    onChange={handleInputChange}
                    placeholder={`${order.total_amount.toFixed(2)}`}
                    className={formErrors.amount ? 'error' : ''}
                    disabled={submitting}
                    required
                  />
                  {formErrors.amount && <div className="error-text">{formErrors.amount}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="payer_name">Nombre del Titular de la Cuenta *</label>
                  <input
                    type="text"
                    id="payer_name"
                    name="payer_name"
                    value={paymentInfo.payer_name}
                    onChange={handleInputChange}
                    placeholder="Ej. Juan Pérez"
                    className={formErrors.payer_name ? 'error' : ''}
                    disabled={submitting}
                    required
                  />
                  {formErrors.payer_name && <div className="error-text">{formErrors.payer_name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Comentarios (opcional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={paymentInfo.notes}
                    onChange={handleInputChange}
                    placeholder="Información adicional sobre el pago"
                    disabled={submitting}
                    rows="3"
                  />
                </div>
                
                <div className="form-actions">
                  <Link 
                    to={`/orders/${orderId}`}
                    className="cancel-btn"
                    disabled={submitting}
                  >
                    Cancelar
                  </Link>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : 'Confirmar Pago'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentConfirmation;