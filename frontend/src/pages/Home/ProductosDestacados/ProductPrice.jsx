const ProductPrice = ({ price, discount }) => {
    const discountedPrice = price * (1 - discount / 100);
  
    return (
      <div className="product-price">
        {discount > 0 ? (
          <>
            <span className="original-price">${price.toFixed(2)}</span>
            <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
          </>
        ) : (
          <span className="current-price">${price.toFixed(2)}</span>
        )}
      </div>
    );
  };
  
  export default ProductPrice;
  