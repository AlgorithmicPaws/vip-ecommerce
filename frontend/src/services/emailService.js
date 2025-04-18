// src/services/emailService.js
import * as api from './apiService';
import * as pdfService from './pdfService';

/**
 * Service for handling email-related operations
 */

// Test sender email for development purposes
const DEV_SENDER_EMAIL = 'sergiojauregui0701@gmail.com';

/**
 * Send an email with order confirmation and PDF invoice
 * @param {Object} orderData - Order data
 * @param {string} email - Recipient email address
 * @param {Blob} pdfBlob - PDF invoice as a Blob
 * @returns {Promise} - Response from the API
 */
export const sendOrderConfirmationEmail = async (orderData, email, pdfBlob) => {
  try {
    // Convert the PDF blob to base64
    const pdfBase64 = await pdfService.pdfToBase64(pdfBlob);
    
    // Prepare email data
    const emailData = {
      from: DEV_SENDER_EMAIL, // Set sender email for testing
      to: email,
      subject: `Confirmación de pedido #${orderData.order_id || orderData.id}`,
      html_content: generateOrderConfirmationHtml(orderData),
      attachments: [
        {
          filename: `factura-${orderData.order_id || orderData.id}.pdf`,
          content: pdfBase64,
          content_type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    // Send the email through the API
    return await api.post('/emails/send', emailData);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Generate HTML content for order confirmation email
 * @param {Object} orderData - Order data
 * @returns {string} - HTML content for the email
 */
const generateOrderConfirmationHtml = (orderData) => {
  // Handle potential undefined values safely
  const safeItems = orderData.items || [];
  
  // Format price with proper handling for potential string values
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };
  
  const items = safeItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name || `Producto #${item.product_id}`}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${formatPrice(item.price_per_unit)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${formatPrice(item.total_price)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmación de Pedido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #3fb0ac; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background-color: #f2f2f2; text-align: left; padding: 10px; }
        .footer { background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; }
        .button { display: inline-block; background-color: #3fb0ac; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
        .totals td { font-weight: bold; }
        .bank-details { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #3fb0ac; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmación de Pedido</h1>
        </div>
        
        <div class="content">
          <p>¡Gracias por tu compra en ConstructMarket Colombia!</p>
          <p>Tu pedido #${orderData.order_id || orderData.id} ha sido registrado y está pendiente de pago.</p>
          
          <div class="order-details">
            <h2>Detalles del Pedido</h2>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>Productos</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: center;">Cantidad</th>
                  <th style="text-align: right;">Precio</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items}
              </tbody>
              <tfoot>
                <tr class="totals">
                  <td colspan="3" style="text-align: right; padding: 10px;">Subtotal:</td>
                  <td style="text-align: right; padding: 10px;">$${formatPrice(orderData.subtotal)}</td>
                </tr>
                ${orderData.discount > 0 ? `
                <tr class="totals">
                  <td colspan="3" style="text-align: right; padding: 10px;">Descuento:</td>
                  <td style="text-align: right; padding: 10px;">-$${formatPrice(orderData.discount)}</td>
                </tr>` : ''}
                <tr class="totals">
                  <td colspan="3" style="text-align: right; padding: 10px;">Gastos de envío:</td>
                  <td style="text-align: right; padding: 10px;">$${formatPrice(orderData.shipping_cost)}</td>
                </tr>
                <tr class="totals">
                  <td colspan="3" style="text-align: right; padding: 10px;">Total:</td>
                  <td style="text-align: right; padding: 10px;">$${formatPrice(orderData.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="payment-instructions">
            <h3>Instrucciones de Pago</h3>
            <p>Para completar tu pedido, por favor realiza una transferencia bancaria a la siguiente cuenta:</p>
            
            <div class="bank-details">
              <p><strong>Banco:</strong> Bancolombia</p>
              <p><strong>Titular:</strong> ConstructMarket Colombia S.A.S</p>
              <p><strong>Cuenta Corriente Nº:</strong> 69812345678</p>
              <p><strong>Concepto:</strong> Pedido ${orderData.order_id || orderData.id}</p>
              <p><strong>Importe:</strong> $${formatPrice(orderData.total_amount)}</p>
            </div>
            
            <p>Una vez realizada la transferencia, por favor envía el comprobante de pago a <strong>pedidos@constructmarket.com.co</strong></p>
            <p>Tu pedido será procesado en cuanto confirmemos el pago.</p>
          </div>
          
          <div class="shipping-info">
            <h3>Información de Envío</h3>
            <p>
              ${orderData.shipping_address.street}<br>
              ${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zip_code}<br>
              ${orderData.shipping_address.country}
            </p>
          </div>
          
          <p>Hemos adjuntado la factura en formato PDF a este correo. También puedes acceder a tus pedidos y facturas desde tu cuenta en cualquier momento.</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://constructmarket.com.co/orders" class="button">Ver Mi Pedido</a>
          </p>
        </div>
        
        <div class="footer">
          <p>ConstructMarket Colombia S.A.S - Calle 85 # 11-53, Bogotá D.C., Colombia</p>
          <p>Teléfono: (601) 432-1000 - Email: info@constructmarket.com.co</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send a generic email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Array} attachments - Optional array of attachment objects
 * @returns {Promise} - Response from the API
 */
export const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const emailData = {
      from: DEV_SENDER_EMAIL, // Set sender email for testing
      to,
      subject,
      html_content: htmlContent,
      attachments
    };
    
    return await api.post('/emails/send', emailData);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};