const Productguarantees = ({product}) => {
  return (
    <div className="product-guarantees">
      <div className="guarantee-item">
        <span className="guarantee-icon">✓</span>
        <div className="guarantee-text">
          <strong>Garantía:</strong> {product.warranty}
        </div>
      </div>
      <div className="guarantee-item">
        <span className="guarantee-icon">↩️</span>
        <div className="guarantee-text">
          <strong>Devoluciones:</strong> {product.shippingInfo.returns}
        </div>
      </div>
      <div className="guarantee-item">
        <span className="guarantee-icon">🔒</span>
        <div className="guarantee-text">
          <strong>Pago seguro:</strong> Información cifrada
        </div>
      </div>
    </div>
  );
};

export default Productguarantees;
