import { Link } from "react-router-dom";


const CartActions = ({clearCart}) => {
  return (
    <div className="cart-actions">
      <button className="clear-cart-btn" onClick={clearCart}>
        Vaciar Carrito
      </button>
      <Link to="/catalog" className="continue-shopping-btn">
        Seguir Comprando
      </Link>
    </div>
  );
};

export default CartActions;
