import React from 'react';

const CheckoutSummary = ({
  subtotal,
  shippingCost,
  discount,
  total,
  couponCode,
  setCouponCode,
  couponApplied,
  onApplyCoupon,
  cartItems
}) => {
  return (
    <div className="checkout-summary">
      <h2>Resumen del Pedido</h2>
      
      <div className="cart-items-summary">
        <h3>Productos ({cartItems.length})</h3>
        <div className="summary-items">
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
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
                <h4>{item.name}</h4>
                <div className="item-meta">
                  <span className="item-quantity">Cantidad: {item.quantity}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="coupon-section">
        <h3>¿Tienes un Cupón?</h3>
        <div className="coupon-input">
          <input
            type="text"
            placeholder="Código de descuento"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
          />
          <button 
            onClick={onApplyCoupon}
            disabled={couponApplied}
          >
            {couponApplied ? '✓ Aplicado' : 'Aplicar'}
          </button>
        </div>
        {!couponApplied && (
          <p className="coupon-hint">Prueba con: CONSTRU20</p>
        )}
      </div>
      
      <div className="price-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Envío</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="summary-row discount">
            <span>Descuento</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="summary-policies">
        <p>
          <strong>Política de envío:</strong> Entrega en 24-48h para península. Para envíos a islas, el plazo es de 3-5 días laborables.
        </p>
        <p>
          <strong>Política de devoluciones:</strong> Dispones de 30 días para devoluciones. Puedes gestionar todo el proceso desde tu área de cliente.
        </p>
      </div>
      
      <div className="payment-methods-info">
        <p>Métodos de pago aceptados:</p>
        <div className="payment-icons">
          <span className="payment-icon">💳</span>
          <span className="payment-icon">🏦</span>
          <span className="payment-icon">📱</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;