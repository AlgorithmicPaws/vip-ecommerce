const ProcuctPayment = ({product}) => {
  return (
    <div className="product-payment">
      <div className="payment-label">Métodos de pago:</div>
      <div className="payment-methods">
        {product.paymentOptions.map((method, index) => (
          <span key={index} className="payment-method">
            {method}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProcuctPayment;
