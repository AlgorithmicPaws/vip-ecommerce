const ThumbnailContainer = ({ product, selectedImage, setSelectedImage}) => {
  return (
    <div className="thumbnail-container">
      {product.images.map((image, index) => (
        <div
          key={index}
          className={`thumbnail ${selectedImage === index ? "active" : ""}`}
          onClick={() => setSelectedImage(index)}
        >
          {image ? (
            <img src={image} alt={`Miniatura ${index + 1}`} />
          ) : (
            <div className="thumbnail-placeholder">
              <span>{index + 1}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThumbnailContainer;
