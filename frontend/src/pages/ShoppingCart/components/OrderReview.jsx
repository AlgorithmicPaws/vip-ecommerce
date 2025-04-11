import React from 'react';

const OrderReview = ({ shippingData, paymentMethod, cardData, cartItems }) => {
  // Función para mostrar los últimos 4 dígitos de la tarjeta
  const getLastFourDigits = (cardNumber) => {
    if (!cardNumber || cardNumber.length < 4) return 'XXXX';
    return cardNumber.slice(-4).padStart(cardNumber.length, '*');
  };
  
  return (
    <div className="order-review-container">
      <h2>Revisar Pedido</h2>
      
      <div className="form-description">
        <p>Por favor, revise la información de su pedido antes de finalizar la compra.</p>
      </div>
      
      <div className="review-sections">
        {/* Sección de dirección de envío */}
        <div className="review-section">
          <div className="section-header">
            <h3>Dirección de Envío</h3>
          </div>
          
          <div className="section-content">
            <p className="review-name">{shippingData.fullName}</p>
            <p className="review-address">{shippingData.address}</p>
            <p className="review-city">{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
            <p className="review-contact">
              <span className="review-email">{shippingData.email}</span>
              <span className="review-phone">{shippingData.phone}</span>
            </p>
          </div>
        </div>
        
        {/* Sección de método de pago */}
        <div className="review-section">
          <div className="section-header">
            <h3>Método de Pago</h3>
          </div>
          
          <div className="section-content">
            {paymentMethod === 'creditCard' && (
              <div className="payment-info">
                <p className="payment-type">Tarjeta de Crédito/Débito</p>
                <p className="card-info">
                  <span className="card-icon">💳</span>
                  <span className="card-number">{getLastFourDigits(cardData.cardNumber)}</span>
                  <span className="card-name">{cardData.cardName}</span>
                </p>
              </div>
            )}
            
            {paymentMethod === 'paypal' && (
              <div className="payment-info">
                <p className="payment-type">PayPal</p>
                <p className="paypal-info">
                  <span className="paypal-icon">🅿️</span>
                  Pago a través de PayPal
                </p>
              </div>
            )}
            
            {paymentMethod === 'transferencia' && (
              <div className="payment-info">
                <p className="payment-type">Transferencia Bancaria</p>
                <p className="transfer-info">
                  <span className="bank-icon">🏦</span>
                  Pago por transferencia bancaria
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sección de productos */}
        <div className="review-section">
          <div className="section-header">
            <h3>Productos</h3>
          </div>
          
          <div className="section-content">
            <div className="review-products">
              {cartItems.map((item) => (
                <div key={item.id} className="review-product">
                  <div className="product-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">
                        <span>{item.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-details">
                    <h4 className="product-name">{item.name}</h4>
                    <p className="product-seller">Vendido por: {item.seller || "ConstructMarket"}</p>
                  </div>
                  
                  <div className="product-quantity">
                    <span>Cantidad: {item.quantity}</span>
                  </div>
                  
                  <div className="product-price">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="order-terms">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          He leído y acepto los <a href="/terms" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a> y la <a href="/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>.
        </label>
      </div>
      
      <div className="order-confirmation-note">
        <p>
          <strong>Nota:</strong> Al hacer clic en "Realizar Pedido", confirmas tu compra y autorizas el cargo por el importe total.
        </p>
      </div>
    </div>
  );
};

export default OrderReview;