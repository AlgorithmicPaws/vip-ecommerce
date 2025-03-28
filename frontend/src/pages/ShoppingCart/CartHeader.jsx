import { Link } from "react-router-dom";

const CartHeader = () => {
  return (
    <header className="cart-header">
        <div className="header-top">
          <div className="logo">
            <Link to="/">ConstructMarket</Link>
          </div>
          <div className="header-actions">
            <Link to="/catalog" className="back-to-store">Seguir Comprando</Link>
          </div>
        </div>
      </header>
  );
};

export default CartHeader;