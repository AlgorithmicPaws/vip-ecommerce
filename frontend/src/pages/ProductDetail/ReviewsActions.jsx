const ReviewsActions = ({setShowReviewForm, showReviewForm}) => {
  return (
    <div className="reviews-actions">
      <button
        className="write-review-btn"
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        Escribir una reseña
      </button>
    </div>
  );
};

export default ReviewsActions;
