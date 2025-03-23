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
            <span>{product.name.charAt(0)}</span>
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
      </div>
    </div>
  );
};

export default ProductCard;
