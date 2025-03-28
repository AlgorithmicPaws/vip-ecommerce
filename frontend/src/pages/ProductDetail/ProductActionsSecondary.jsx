const ProductActionsSecondary = () => {
  return (
    <div className="product-actions-secondary">
      <button className="action-btn wishlist-btn">
        <span className="action-icon">❤️</span> Añadir a Favoritos
      </button>
      <button className="action-btn compare-btn">
        <span className="action-icon">⚖️</span> Comparar
      </button>
      <button className="action-btn share-btn">
        <span className="action-icon">🔗</span> Compartir
      </button>
    </div>
  );
};

export default ProductActionsSecondary;
