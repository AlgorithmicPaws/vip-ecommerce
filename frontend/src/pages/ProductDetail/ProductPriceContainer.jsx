const ProductPriceContainer = ({product}) => {
  return (
    <div className="product-price-container">
      {product.discount > 0 ? (
        <>
          <div className="price-original">
            ${product.originalPrice.toFixed(2)}
          </div>
          <div className="price-current">${product.price.toFixed(2)}</div>
          <div className="price-saving">
            Ahorras: ${(product.originalPrice - product.price).toFixed(2)} (
            {product.discount}%)
          </div>
        </>
      ) : (
        <div className="price-current">${product.price.toFixed(2)}</div>
      )}
    </div>
  );
};

export default ProductPriceContainer;
