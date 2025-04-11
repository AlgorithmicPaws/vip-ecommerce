import React from 'react';

const PaymentMethod = ({ 
  paymentMethod, 
  onPaymentMethodChange, 
  cardData, 
  onCardDataChange 
}) => {
  return (
    <div className="payment-method-container">
      <h2>Método de Pago</h2>
      
      <div className="form-description">
        <p>El pago se realizará mediante transferencia bancaria.</p>
      </div>
      
      <div className="payment-options">
        <div className="payment-option">
          <label className="radio-label">
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              checked={true}
              readOnly
            />
            <div className="option-info">
              <div className="option-name">Transferencia Bancaria</div>
              <div className="option-description">Recibirás instrucciones para realizar la transferencia</div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="transfer-info">
        <p>Una vez confirmado el pedido, recibirás las instrucciones para realizar la transferencia bancaria.</p>
        <div className="bank-details">
          <p><strong>Entidad:</strong> Banco Construcción</p>
          <p><strong>Titular:</strong> ConstructMarket S.L.</p>
          <p><strong>IBAN:</strong> ES12 3456 7890 1234 5678 9012</p>
        </div>
        <p className="note">* El pedido no se procesará hasta recibir la confirmación del pago.</p>
      </div>
      
      <div className="payment-security">
        <div className="security-badge">
          <span className="security-icon">🔒</span>
          <span>Pago 100% Seguro</span>
        </div>
        <p className="security-text">
          Tu información está protegida con cifrado SSL de 256 bits
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;