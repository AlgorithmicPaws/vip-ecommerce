
const ReviewsList = ({reviews, renderRatingStars, setShowReviewForm}) => {
  return (
    <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-author-info">
                            <div className="review-author">{review.author}</div>
                            {review.verified && (
                              <div className="verified-badge">Compra verificada</div>
                            )}
                          </div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        
                        <div className="review-rating">
                          {renderRatingStars(review.rating)}
                        </div>
                        
                        <div className="review-content">
                          {review.comment}
                        </div>
                        
                        <div className="review-actions">
                          <button className="helpful-btn">
                            Útil ({review.helpful})
                          </button>
                          <button className="report-btn">
                            Reportar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>Aún no hay reseñas para este producto.</p>
                      <button 
                        className="write-review-btn"
                        onClick={() => setShowReviewForm(true)}
                      >
                        Sé el primero en escribir una reseña
                      </button>
                    </div>
                  )}
                </div>
  );
};

export default ReviewsList;