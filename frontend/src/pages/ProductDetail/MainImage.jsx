const MainImage = ({product, selectedImage}) => {
  return (
    <div className="main-image">
      {product.images[selectedImage] ? (
        <img
          src={product.images[selectedImage]}
          alt={`${product.name} - Imagen ${selectedImage + 1}`}
          className="product-img"
        />
      ) : (
        <div className="image-placeholder">
          <span>{product.name.charAt(0)}</span>
        </div>
      )}
      {product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
    </div>
  );
};

export default MainImage;
