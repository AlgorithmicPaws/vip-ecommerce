import React, { useState } from 'react';

const RatingFilter = ({ onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(null);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  return (
    <div className="filter-section">
      <h3>Valoración</h3>
      <div className="rating-filter">
        <label className="radio-label">
          <input 
            type="radio" 
            name="rating" 
            checked={selectedRating === 4}
            onChange={() => handleRatingChange(4)}
          /> 
          4★ y más
        </label>
        <label className="radio-label">
          <input 
            type="radio" 
            name="rating" 
            checked={selectedRating === 3}
            onChange={() => handleRatingChange(3)}
          /> 
          3★ y más
        </label>
        <label className="radio-label">
          <input 
            type="radio" 
            name="rating" 
            checked={selectedRating === 2}
            onChange={() => handleRatingChange(2)}
          /> 
          2★ y más
        </label>
        <label className="radio-label">
          <input 
            type="radio" 
            name="rating" 
            checked={selectedRating === 1}
            onChange={() => handleRatingChange(1)}
          /> 
          1★ y más
        </label>
      </div>
    </div>
  );
};

export default RatingFilter;