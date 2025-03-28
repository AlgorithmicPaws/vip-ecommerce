const AddToCart = ({handleAddToCart, handleBuyNow}) => {
  return (
    <div className="cart-actions">
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Añadir al Carrito
      </button>
      <button className="buy-now-btn" onClick={handleBuyNow}>
        Comprar Ahora
      </button>
    </div>
  );
};

export default AddToCart;
