import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/catalog/product/${product.id}`)}
    >
      {product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
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
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <ProductRating rating={product.rating} />
          <span className="product-seller">por {product.seller}</span>
        </div>
        <ProductPrice price={product.price} discount={product.discount} />
        <button className="view-product-btn">Ver Producto</button>
      </div>
    </div>
  );
};

export default ProductCard;