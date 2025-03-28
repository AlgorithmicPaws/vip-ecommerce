const ReviewFormContainer = ({reviewForm, setReviewForm, handleReviewSubmit, setShowReviewForm}) => {
  return (
    <div className="review-form-container">
      <h3>Escribe tu reseña</h3>
      <form onSubmit={handleReviewSubmit} className="review-form">
        <div className="form-group">
          <label>Valoración</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`star-btn ${
                  reviewForm.rating >= star ? "selected" : ""
                }`}
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={reviewForm.name}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={reviewForm.email}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Comentario</label>
          <textarea
            rows="4"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowReviewForm(false)}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Enviar Reseña
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewFormContainer;
