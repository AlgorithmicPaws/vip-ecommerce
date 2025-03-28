const ProductShipping = ({product}) => {
  return (
    <div className="product-shipping">
      {product.shippingInfo.free ? (
        <div className="free-shipping">
          <span className="shipping-icon">🚚</span> Envío gratuito
        </div>
      ) : (
        <div className="shipping-cost">
          <span className="shipping-icon">🚚</span> Gastos de envío: $X.XX
        </div>
      )}
      <div className="delivery-time">
        <span className="delivery-icon">📦</span> Entrega estimada:{" "}
        {product.shippingInfo.estimatedDelivery}
      </div>
    </div>
  );
};

export default ProductShipping;
