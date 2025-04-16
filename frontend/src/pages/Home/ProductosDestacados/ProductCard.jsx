import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Calculate discount if needed
  // In a real implementation, the discount would likely come from the API
  // For now, we'll use a random discount for demo purposes
  const getRandomDiscount = () => {
    const discounts = [0, 0, 0, 5, 10, 15, 20];
    return discounts[Math.floor(Math.random() * discounts.length)];
  };

  // Add discount if not present
  const productWithDiscount = {
    ...product,
    discount: product.discount || getRandomDiscount()
  };

  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/catalog/product/${product.id}`)}
    >
      {productWithDiscount.discount > 0 && (
        <div className="discount-badge">-{productWithDiscount.discount}%</div>
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
        <ProductPrice price={product.price} discount={productWithDiscount.discount} />
      </div>
    </div>
  );
};

export default ProductCard;