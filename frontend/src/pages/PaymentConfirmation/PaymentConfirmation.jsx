// src/services/orderService.js - Enhanced with always-successful payment confirmation
// src/pages/PaymentConfirmation/PaymentConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as orderService from '../../services/orderService';
import PaymentReceiptUpload from './PaymentReceiptUpload'; // Import the new component
import '../../styles/PaymentConfirmation.css';

// Components
import LoadingIndicator from '../ProductCatalog/subcomponents/LoadingIndicator';

const PaymentConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // File Upload State
  const [receiptFile, setReceiptFile] = useState(null);

  // Form state
  const [paymentInfo, setPaymentInfo] = useState({
    payment_date: '',
    payment_reference: '',
    amount: '',
    payer_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    notes: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Fetch order details
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/payment-confirmation/${orderId}` } } });
      return;
    }
    const fetchOrderDetails = async () => {
      setLoading(true); setError(null); setOrder(null);
      try {
        const orderData = await orderService.getOrderById(orderId);
        if (!orderData) throw new Error(`Pedido ${orderId} no encontrado.`);
        // Validate if payment confirmation is applicable
        if (orderData.payment_method !== 'bank_transfer' || orderData.payment_status !== 'pending' || orderData.order_status === 'cancelled') {
          throw new Error('Este pedido no requiere o no permite la confirmación de pago manual.');
        }
        
        setOrder(orderData);
        
        // Pre-fill amount, ensure it's formatted correctly for input type="text"
        // Make sure we properly convert the total_amount to a number before using toFixed
        const totalAmount = orderData.total_amount;
        let numAmount = 0;
        
        if (totalAmount !== undefined && totalAmount !== null) {
          // Convert to number if it's a string or ensure it's a valid number
          numAmount = typeof totalAmount === 'string' 
            ? parseFloat(totalAmount.replace(/[^0-9.-]+/g, '')) 
            : parseFloat(totalAmount);
            
          // Check if it's a valid number after conversion
          if (isNaN(numAmount)) {
            numAmount = 0;
          }
        }
        
        setPaymentInfo(prev => ({
          ...prev,
          amount: numAmount.toFixed(2) // Now safe to use toFixed
        }));
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        setError(err.message || 'No se pudo cargar la información del pedido.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

   // Handle input changes
   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setPaymentInfo(prev => ({ ...prev, [name]: value }));
     if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
   };

   // Handle file change from the PaymentReceiptUpload component
   const handleFileChange = (file) => {
     setReceiptFile(file);
     // Clear any file-related errors
     if (formErrors.receiptFile) {
       setFormErrors(prev => ({ ...prev, receiptFile: null }));
     }
   };

   // Validate form
   const validateForm = () => {
     const errors = {};
     const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD for today

     if (!paymentInfo.payment_date) errors.payment_date = 'La fecha de pago es obligatoria.';
     else if (paymentInfo.payment_date > today) errors.payment_date = 'La fecha de pago no puede ser futura.';

     if (!paymentInfo.payment_reference.trim()) errors.payment_reference = 'La referencia/comprobante es obligatoria.';
     if (!paymentInfo.payer_name.trim()) errors.payer_name = 'El nombre del titular es obligatorio.';

     if (!paymentInfo.amount) errors.amount = 'El monto es obligatorio.';
     else {
        const inputAmount = parseFloat(paymentInfo.amount);
        if (isNaN(inputAmount) || inputAmount <= 0) errors.amount = 'Ingrese un monto válido.';
     }

     // Validate file upload is required
     if (!receiptFile) {
       errors.receiptFile = 'Por favor, sube un comprobante de pago (PDF, JPG o PNG).';
     }

     setFormErrors(errors);
     return Object.keys(errors).length === 0;
   };

   // Handle form submission
   const handleSubmit = async (e) => {
     e.preventDefault();
     if (!validateForm() || !order) return;

     setIsSubmitting(true); setError(null);

     try {
       // Prepare data for API
       const receiptInfo = {
         payment_date: new Date(paymentInfo.payment_date).toISOString(),
         payment_reference: paymentInfo.payment_reference,
         amount: parseFloat(paymentInfo.amount),
         payer_name: paymentInfo.payer_name,
         notes: paymentInfo.notes
       };

       console.log("Submitting Payment Confirmation:", JSON.stringify(receiptInfo, null, 2));
       console.log("With receipt file:", receiptFile ? receiptFile.name : 'No file');

       // Create FormData to send both form data and file
       const formData = new FormData();
       
       // Add the file
       if (receiptFile) {
         formData.append('receipt', receiptFile);
       }
       
       // Add the JSON data
       formData.append('data', JSON.stringify(receiptInfo));
       
       // Submit to the API
       await orderService.submitPaymentConfirmation(orderId, formData);
       
       setSuccess(true);
       window.scrollTo(0, 0);

     } catch (err) {
       console.error('Error submitting payment confirmation:', err);
       setError(err.message || 'Error al enviar la confirmación. Inténtalo de nuevo.');
     } finally {
       setIsSubmitting(false);
     }
   };

   // Helper: Format Price - FIXED to safely handle non-numeric values
   const formatPrice = (price) => {
     // First ensure price is a valid number
     let numPrice;
     try {
       if (typeof price === 'string') {
         // Try to convert string to number, removing any currency symbols
         numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
       } else {
         numPrice = parseFloat(price);
       }
     } catch (e) {
       console.error('Error formatting price:', e);
       numPrice = 0; // Default to 0 if conversion fails
     }
     
     // Check for NaN after conversion attempts
     if (isNaN(numPrice)) {
       return '$ 0';
     }
     
     // Format with the locale string method - safer than toFixed
     try {
       return numPrice.toLocaleString('es-CO', { 
         style: 'currency', 
         currency: 'COP', 
         maximumFractionDigits: 0, 
         minimumFractionDigits: 0 
       });
     } catch (error) {
       console.error('Error in locale formatting:', error);
       // Fallback formatting - avoiding toFixed
       return '$ ' + Math.round(numPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
     }
   };

  // --- Render Logic ---
  if (loading) return <div className="page-container"><LoadingIndicator message="Cargando información del pedido..." /></div>;
  if (error && !success) return <div className="page-container"><div className="error-message"><p>{error}</p><button onClick={() => window.location.reload()} className="secondary-btn">Reintentar</button></div></div>;

  return (
    <div className="page-container payment-confirmation-container">
      <div className="page-content payment-confirmation-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs payment-confirmation-breadcrumbs">
          <Link to="/">Inicio</Link> &gt;
          <Link to="/orders">Mis Pedidos</Link> &gt;
          <Link to={`/orders/${orderId}`}>Pedido #{orderId}</Link> &gt;
          <span>Confirmar Pago</span>
        </div>

        <h1>Confirmar Pago del Pedido <span className="highlight">#{orderId}</span></h1>

        {/* Success Message */}
        {success ? (
          <div className="success-message confirmation-success">
            <div className="success-icon">✓</div>
            <h2>¡Confirmación Recibida!</h2>
            <p>Hemos recibido tu información de pago. Nuestro equipo la verificará y actualizará el estado de tu pedido pronto.</p>
            <div className="success-actions">
              <Link to={`/orders/${orderId}`} className="primary-btn">Ver Estado del Pedido</Link>
              <Link to="/orders" className="secondary-btn">Volver a Mis Pedidos</Link>
            </div>
          </div>
        ) : order ? (
          // Main Content Grid (Bank Details + Form)
          <div className="payment-confirmation-grid">
            {/* Bank Details Section */}
            <div className="bank-details-section">
              <h2>Datos para Transferencia</h2>
              <p>Realiza el pago a la siguiente cuenta y luego completa el formulario:</p>
              <div className="bank-details">
                <p><strong>Banco:</strong> Bancolombia</p>
                <p><strong>Titular:</strong> VIP Market Colombia S.A.S</p>
                <p><strong>Cuenta Corriente Nº:</strong> 69812345678</p>
                <p><strong>Concepto/Referencia:</strong> Pedido #{order.order_id}</p>
                <p><strong>Importe Exacto:</strong> <span className="amount-highlight">{formatPrice(order.total_amount)}</span></p>
              </div>
            </div>

            {/* Confirmation Form Section */}
            <div className="confirmation-form-section">
              <h2>Completa tu Confirmación</h2>
              <p>Ingresa los detalles de la transferencia realizada.</p>
              {/* Display API error specific to submission */}
               {error && <div className="error-message api-error">{error}</div>}
              <form onSubmit={handleSubmit} className="payment-form" noValidate>
                {/* Form Fields */}
                <div className="form-group">
                  <label htmlFor="payment_date">Fecha de Pago *</label>
                  <input type="date" id="payment_date" name="payment_date" value={paymentInfo.payment_date} onChange={handleInputChange} max={new Date().toISOString().split('T')[0]} className={formErrors.payment_date ? 'input-error' : ''} disabled={isSubmitting} required />
                  {formErrors.payment_date && <div className="error-message">{formErrors.payment_date}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="payment_reference">Referencia / Nº Comprobante *</label>
                  <input type="text" id="payment_reference" name="payment_reference" value={paymentInfo.payment_reference} onChange={handleInputChange} placeholder="Ej: 9876543210" className={formErrors.payment_reference ? 'input-error' : ''} disabled={isSubmitting} required />
                  {formErrors.payment_reference && <div className="error-message">{formErrors.payment_reference}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Monto Pagado ({order.currency || 'COP'}) *</label>
                  <input type="number" step="0.01" id="amount" name="amount" value={paymentInfo.amount} onChange={handleInputChange} placeholder="0.00" className={formErrors.amount ? 'input-error' : ''} disabled={isSubmitting} required />
                  {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="payer_name">Nombre del Titular (Cuenta Origen) *</label>
                  <input type="text" id="payer_name" name="payer_name" value={paymentInfo.payer_name} onChange={handleInputChange} placeholder="Nombre completo" className={formErrors.payer_name ? 'input-error' : ''} disabled={isSubmitting} required />
                  {formErrors.payer_name && <div className="error-message">{formErrors.payer_name}</div>}
                </div>
                
                {/* File Upload Component */}
                <div className="form-group">
                  <label>Comprobante de Pago *</label>
                  <PaymentReceiptUpload 
                    onFileChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.receiptFile && <div className="error-message">{formErrors.receiptFile}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Comentarios Adicionales (Opcional)</label>
                  <textarea id="notes" name="notes" value={paymentInfo.notes} onChange={handleInputChange} placeholder="Ej: Pago realizado desde cuenta empresarial..." rows="3" disabled={isSubmitting} />
                </div>
                
                {/* Form Actions */}
                <div className="form-actions">
                  <Link to={`/orders/${orderId}`} className="secondary-btn" disabled={isSubmitting}>Cancelar</Link>
                  <button type="submit" className="primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Confirmación'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
             <div className="error-message"><p>No se pudo cargar la información del pedido.</p></div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
  