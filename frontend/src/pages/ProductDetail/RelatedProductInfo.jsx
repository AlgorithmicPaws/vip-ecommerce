const RelatedProductInfo = ({product, renderRatingStars}) => {
  return (
    <div className="related-product-info">
      <div className="related-product-category">{product.category}</div>
      <h3 className="related-product-name">{product.name}</h3>
      <div className="related-product-rating">
        {renderRatingStars(product.rating)}
      </div>
      <div className="related-product-price">${product.price.toFixed(2)}</div>
    </div>
  );
};

export default RelatedProductInfo;
