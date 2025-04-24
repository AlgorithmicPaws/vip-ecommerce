import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";
import { useCart } from "../../../pages/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  // Handle discount information - if not available in the product object, default to 0
  const discount = product.discount || 0;

  // Handle click to navigate to product detail
  const handleCardClick = () => {
    navigate(`/catalog/product/${product.id}`);
  };

  // Handle add to cart action
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation
    addToCart(product, 1);
  };

  return (
    <div 
      className="product-card"
      onClick={handleCardClick}
    >
      {discount > 0 && (
        <div className="discount-badge">-{discount}%</div>
      )}
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
          </div>
        )}
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <div className="stock-badge">¡Pocas unidades!</div>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category || "Sin categoría"}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-seller">por {product.seller || "ConstructMarket"}</span>
        </div>
        <ProductPrice price={product.price} discount={discount} />
        
        {isInCart && isInCart(product.id) ? (
          <button 
            className="view-product-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/cart');
            }}
          >
            Ver en Carrito
          </button>
        ) : (
          <button 
            className="view-product-btn"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;