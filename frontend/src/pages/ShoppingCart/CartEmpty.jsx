import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">🛒</div>
      <h2>Tu carrito está vacío</h2>
      <p>Parece que aún no has añadido productos a tu carrito.</p>
      <Link to="/catalog" className="continue-shopping-btn">
        Ver Productos
      </Link>
    </div>
  );
};

export default CartEmpty;
