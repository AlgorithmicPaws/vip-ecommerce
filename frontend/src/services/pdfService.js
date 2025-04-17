// src/services/pdfService.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
    doc.text(`Nombre: ${orderData.customer?.first_name || user?.first_name} ${orderData.customer?.last_name || user?.last_name}`, 20, 72);
    doc.text(`Email: ${orderData.customer?.email || user?.email}`, 20, 79);
    
    // Shipping address
    const shipAddress = orderData.shipping_address;
    doc.text('Dirección de envío:', 20, 92);
    doc.text(`${shipAddress.street}`, 20, 99);
    doc.text(`${shipAddress.city}, ${shipAddress.state} ${shipAddress.zip_code}`, 20, 106);
    doc.text(`${shipAddress.country}`, 20, 113);
    
    // Order items table
    doc.autoTable({
      startY: 125,
      head: [['Producto', 'Cantidad', 'Precio unidad', 'Total']],
      body: orderData.items.map(item => [
        item.name || `Producto #${item.product_id}`,
        item.quantity,
        `$${formatPrice(item.price_per_unit)}`,
        `$${formatPrice(item.total_price)}`
      ]),
      foot: [
        ['Subtotal', '', '', `$${formatPrice(orderData.subtotal)}`],
        [orderData.discount > 0 ? 'Descuento' : '', '', '', orderData.discount > 0 ? `$${formatPrice(orderData.discount)}` : ''],
        ['Gastos de envío', '', '', `$${formatPrice(orderData.shipping_cost)}`],
        ['TOTAL', '', '', `$${formatPrice(orderData.total_amount)}`]
      ],
      footStyles: { fillColor: [240, 240, 240], fontSize: 12, fontStyle: 'bold' },
      theme: 'grid'
    });
    
    // Add payment method information
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Método de pago: Transferencia bancaria', 20, finalY);
    
    // Add bank transfer instructions
    doc.text('Instrucciones de pago:', 20, finalY + 10);
    doc.text('Banco: Bancolombia', 25, finalY + 20);
    doc.text('Titular: ConstructMarket Colombia S.A.S', 25, finalY + 27);
    doc.text('Cuenta Corriente Nº: 69812345678', 25, finalY + 34);
    doc.text(`Concepto: Pedido ${orderData.order_id || orderData.id}`, 25, finalY + 41);
    doc.text(`Importe: $${formatPrice(orderData.total_amount)}`, 25, finalY + 48);
    
    // Add notes section if present
    if (orderData.notes) {
      doc.text('Notas:', 20, finalY + 58);
      doc.text(orderData.notes, 20, finalY + 65);
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