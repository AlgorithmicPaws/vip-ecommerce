import { Link } from "react-router-dom";

const ProductMeta = ({product , renderRatingStars}) => {
  return (
    <div className="product-meta">
      <div className="product-rating">
        {renderRatingStars(product.rating)}
        <span className="rating-count">
          {product.rating} ({product.reviewCount} reseñas)
        </span>
      </div>

      <div className="product-brand">
        <span className="meta-label">Marca:</span>
        <Link
          to={`/catalog?brand=${encodeURIComponent(product.brand)}`}
          className="meta-value brand-link"
        >
          {product.brand}
        </Link>
      </div>

      <div className="product-model">
        <span className="meta-label">Modelo:</span>
        <span className="meta-value">{product.model}</span>
      </div>

      <div className="product-sku">
        <span className="meta-label">SKU:</span>
        <span className="meta-value">{product.sku}</span>
      </div>
    </div>
  );
};

export default ProductMeta;
