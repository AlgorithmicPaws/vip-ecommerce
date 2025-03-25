import React from 'react';
import RatingStars from './RatingStars';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <h3>{review.productName}</h3>
        <span className="review-date">{review.date}</span>
      </div>
      
      <div className="rating">
        <RatingStars rating={review.rating} />
      </div>
      
      <p className="review-comment">{review.comment}</p>
      
      <div className="review-actions">
        <button 
          className="edit-review-btn"
          onClick={onEdit}
        >
          Editar
        </button>
        <button 
          className="delete-review-btn"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;