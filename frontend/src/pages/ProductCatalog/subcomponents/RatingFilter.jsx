import React, { useState } from 'react';

const RatingFilter = ({ onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const handleRatingChange = (rating) => {
    if (selectedRating === rating) {
      // Si se selecciona el mismo rating, deseleccionarlo
      setSelectedRating(null);
      if (onRatingChange) {
        onRatingChange(null);
      }
    } else {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  // Renderizar estrellas para cada opción
  const renderStars = (count) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= count) {
        stars.push(<span key={i} className="star full">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return <div className="rating-stars">{stars}</div>;
  };

  return (
    <div className="rating-filter">
      <label className="radio-label">
        <input 
          type="radio" 
          name="rating" 
          checked={selectedRating === 4}
          onChange={() => handleRatingChange(4)}
        /> 
        {renderStars(4)} y más
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="rating" 
          checked={selectedRating === 3}
          onChange={() => handleRatingChange(3)}
        /> 
        {renderStars(3)} y más
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="rating" 
          checked={selectedRating === 2}
          onChange={() => handleRatingChange(2)}
        /> 
        {renderStars(2)} y más
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="rating" 
          checked={selectedRating === 1}
          onChange={() => handleRatingChange(1)}
        /> 
        {renderStars(1)} y más
      </label>
    </div>
  );
};

export default RatingFilter;