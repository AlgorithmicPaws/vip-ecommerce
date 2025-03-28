import { Link } from "react-router-dom";
const SellerInfo = ({product, renderRatingStars}) => {
  return (
    <div className="seller-info">
      <span className="seller-label">Vendido por:</span>
      <Link
        to={`/seller/${encodeURIComponent(product.seller)}`}
        className="seller-name"
      >
        {product.seller}
      </Link>
      <div className="seller-rating">
        {renderRatingStars(product.sellerRating)}
        <span className="seller-since">Desde {product.sellerSince}</span>
      </div>
    </div>
  );
};

export default SellerInfo;
