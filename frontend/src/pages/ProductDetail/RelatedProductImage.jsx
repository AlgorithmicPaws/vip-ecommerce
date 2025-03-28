const RelatedProductImage = ({product}) => {
  return (
    <div className="related-product-image">
      {product.image ? (
        <img src={product.image} alt={product.name} />
      ) : (
        <div className="image-placeholder small">
          <span>{product.name.charAt(0)}</span>
        </div>
      )}
    </div>
  );
};

export default RelatedProductImage;
