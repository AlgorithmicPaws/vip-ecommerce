const ProductPrice = ({ price, discount = 0 }) => {
  // Make sure price is a number and handle edge cases
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price || 0;
  const discountPercent = typeof discount === 'string' ? parseFloat(discount) : discount || 0;
  
  const formatPrice = (value) => {
    // Format with thousands separator (.) and no decimals for COP
    try {
      return Math.round(value).toLocaleString('es-CO');
    } catch (error) {
      console.error('Error formatting price:', error);
      return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  };
  
  // Calculate discounted price if discount is greater than 0
  const discountedPrice = numericPrice * (1 - discountPercent / 100);
  
  return (
    <div className="product-price">
      {discountPercent > 0 ? (
        <>
          <span className="original-price">${formatPrice(numericPrice)}</span>
          <span className="discounted-price">${formatPrice(discountedPrice)}</span>
        </>
      ) : (
        <span className="current-price">${formatPrice(numericPrice)}</span>
      )}
    </div>
  );
};
  
export default ProductPrice;