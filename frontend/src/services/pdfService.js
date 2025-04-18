// src/services/pdfService.js
import { jsPDF } from 'jspdf';
import * as authService from './authService';

/**
 * Service for generating PDF documents like invoices and order confirmations
 */

/**
 * Generate an order invoice PDF
 * @param {Object} orderData - Complete order data including items, totals, etc.
 * @returns {Blob} - PDF file as a Blob
 */
export const generateOrderInvoice = async (orderData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Get user info for the invoice
    const user = authService.getUserInfo();
    
    // Format price with proper handling for potential string values
    const formatPrice = (price) => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
    };
    
    // Add invoice header
    doc.setFontSize(20);
    doc.text('ConstructMarket Colombia', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('FACTURA', 105, 30, { align: 'center' });
    
    // Add order and customer information
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Nº Pedido: ${orderData.order_id || orderData.id}`, 20, 52);
    
    // Customer information
    doc.text('Datos del cliente:', 20, 65);
    doc.text(`Nombre: ${orderData.customer?.first_name || user?.first_name || ''} ${orderData.customer?.last_name || user?.last_name || ''}`, 20, 72);
    doc.text(`Email: ${orderData.customer?.email || user?.email || ''}`, 20, 79);
    
    // Shipping address
    const shipAddress = orderData.shipping_address || {};
    doc.text('Dirección de envío:', 20, 92);
    doc.text(`${shipAddress.street || ""}`, 20, 99);
    doc.text(`${shipAddress.city || ""}, ${shipAddress.state || ""} ${shipAddress.zip_code || ""}`, 20, 106);
    doc.text(`${shipAddress.country || ""}`, 20, 113);
    
    // Order items table - using basic text instead of autoTable
    let yPos = 130;
    
    // Table headers
    doc.setFont("helvetica", "bold");
    doc.text("Producto", 20, yPos);
    doc.text("Cantidad", 100, yPos);
    doc.text("Precio", 130, yPos);
    doc.text("Total", 170, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    
    // Draw a line below the headers
    doc.setLineWidth(0.5);
    doc.line(20, yPos - 5, 190, yPos - 5);
    
    // Make sure we have items before adding them to the table
    if (orderData.items && orderData.items.length > 0) {
      // Table rows
      orderData.items.forEach(item => {
        // Check if we're about to overflow the page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const productName = item.name || `Producto #${item.product_id}`;
        // Truncate long product names
        const displayName = productName.length > 30 ? productName.substring(0, 27) + '...' : productName;
        
        doc.text(displayName, 20, yPos);
        doc.text(String(item.quantity), 105, yPos);
        doc.text(`$${formatPrice(item.price_per_unit)}`, 130, yPos);
        doc.text(`$${formatPrice(item.total_price)}`, 170, yPos);
        
        yPos += 10;
      });
      
      // Draw a line below the items
      doc.line(20, yPos - 5, 190, yPos - 5);
      
      // Totals
      yPos += 5;
      doc.text("Subtotal:", 130, yPos);
      doc.text(`$${formatPrice(orderData.subtotal)}`, 170, yPos);
      
      if (orderData.discount && orderData.discount > 0) {
        yPos += 10;
        doc.text("Descuento:", 130, yPos);
        doc.text(`-$${formatPrice(orderData.discount)}`, 170, yPos);
      }
      
      yPos += 10;
      doc.text("Gastos de envío:", 130, yPos);
      doc.text(`$${formatPrice(orderData.shipping_cost)}`, 170, yPos);
      
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", 130, yPos);
      doc.text(`$${formatPrice(orderData.total_amount)}`, 170, yPos);
      doc.setFont("helvetica", "normal");
    } else {
      // If there are no items, just add a simple message
      doc.text('No hay productos en el pedido', 20, yPos);
      yPos += 10;
      
      // Add totals manually
      yPos += 10;
      doc.text(`Subtotal: $${formatPrice(orderData.subtotal || 0)}`, 20, yPos);
      yPos += 10;
      
      if (orderData.discount) {
        doc.text(`Descuento: $${formatPrice(orderData.discount)}`, 20, yPos);
        yPos += 10;
      }
      
      doc.text(`Gastos de envío: $${formatPrice(orderData.shipping_cost || 0)}`, 20, yPos);
      yPos += 10;
      
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL: $${formatPrice(orderData.total_amount || 0)}`, 20, yPos);
      doc.setFont("helvetica", "normal");
    }
    
    // Add payment method information
    yPos += 20;
    doc.text('Método de pago: Transferencia bancaria', 20, yPos);
    
    // Add bank transfer instructions
    yPos += 10;
    doc.text('Instrucciones de pago:', 20, yPos);
    yPos += 10;
    doc.text('Banco: Bancolombia', 25, yPos);
    yPos += 7;
    doc.text('Titular: ConstructMarket Colombia S.A.S', 25, yPos);
    yPos += 7;
    doc.text('Cuenta Corriente Nº: 69812345678', 25, yPos);
    yPos += 7;
    doc.text(`Concepto: Pedido ${orderData.order_id || orderData.id}`, 25, yPos);
    yPos += 7;
    doc.text(`Importe: $${formatPrice(orderData.total_amount)}`, 25, yPos);
    
    // Add notes section if present
    if (orderData.notes) {
      yPos += 15;
      doc.text('Notas:', 20, yPos);
      yPos += 7;
      doc.text(orderData.notes, 20, yPos);
    }
    
    // Add footer with company information
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('ConstructMarket Colombia S.A.S - NIT: 901.234.567-8', 105, pageHeight - 25, { align: 'center' });
    doc.text('Calle 85 # 11-53, Bogotá D.C., Colombia', 105, pageHeight - 20, { align: 'center' });
    doc.text('Teléfono: (601) 432-1000 - Email: info@constructmarket.com.co', 105, pageHeight - 15, { align: 'center' });
    
    // Return the PDF as a blob
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Save PDF to file (client-side download)
 * @param {Blob} pdfBlob - PDF file as a Blob
 * @param {string} filename - Name for the saved file
 */
export const savePdfToFile = (pdfBlob, filename) => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convert a PDF blob to base64 string
 * @param {Blob} pdfBlob - PDF file as a Blob
 * @returns {Promise<string>} - Base64 encoded PDF
 */
export const pdfToBase64 = (pdfBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });
};