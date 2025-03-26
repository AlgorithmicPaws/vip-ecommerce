import React from 'react';

const RatingStars = ({ rating, maxStars = 5 }) => {
  // Renderizar estrellas para reseñas
  const renderStars = () => {
    return Array(maxStars).fill(0).map((_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className="rating-stars">
      {renderStars()}
    </div>
  );
};

export default RatingStars;