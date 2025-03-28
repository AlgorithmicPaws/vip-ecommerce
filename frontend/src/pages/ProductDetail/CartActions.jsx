const CartActions = ({product, navigate, getItemQuantity}) => {
  return (
    <div className="cart-actions">
      <div className="in-cart-message">
        Ya tienes {getItemQuantity(product.id)} unidad(es) en el carrito
      </div>
      <button className="view-cart-btn" onClick={() => navigate("/cart")}>
        Ver Carrito
      </button>
    </div>
  );
};

export default CartActions;
