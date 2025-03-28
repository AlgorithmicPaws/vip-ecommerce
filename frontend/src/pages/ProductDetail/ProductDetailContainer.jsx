const ProductDetailContainer = ({navigate}) => {
  return (
    <div className="product-detail-container">
      <div className="error-container">
        <h2>Ha ocurrido un error</h2>
        <p>{error || "No se pudo cargar el producto"}</p>
        <button onClick={() => navigate("/catalog")} className="primary-btn">
          Volver al catálogo
        </button>
      </div>
    </div>
  );
};

export default ProductDetailContainer;
