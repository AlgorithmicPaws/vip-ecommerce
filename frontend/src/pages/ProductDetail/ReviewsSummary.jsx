const ReviewsSummary = ({product, renderRatingStars}) => {
  return (
    <div className="reviews-summary">
      <div className="rating-large">
        <div className="rating-number">{product.rating}</div>
        <div className="rating-stars-large">
          {renderRatingStars(product.rating)}
        </div>
        <div className="rating-count-total">
          Basado en {product.reviewCount} reseñas
        </div>
      </div>

      <div className="rating-breakdown">
        <div className="breakdown-row">
          <span className="stars-label">5 estrellas</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "70%" }}></div>
          </div>
          <span className="percentage">70%</span>
        </div>
        <div className="breakdown-row">
          <span className="stars-label">4 estrellas</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "20%" }}></div>
          </div>
          <span className="percentage">20%</span>
        </div>
        <div className="breakdown-row">
          <span className="stars-label">3 estrellas</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "7%" }}></div>
          </div>
          <span className="percentage">7%</span>
        </div>
        <div className="breakdown-row">
          <span className="stars-label">2 estrellas</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "2%" }}></div>
          </div>
          <span className="percentage">2%</span>
        </div>
        <div className="breakdown-row">
          <span className="stars-label">1 estrella</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "1%" }}></div>
          </div>
          <span className="percentage">1%</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSummary;
