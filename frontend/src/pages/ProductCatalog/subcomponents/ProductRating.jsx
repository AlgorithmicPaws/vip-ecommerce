import React from 'react';

const ProductRating = ({ rating, showNumber = false }) => {
  // Generar estrellas para el rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="product-rating">
      {renderStars()}
      {showNumber && <span className="rating-number">({rating})</span>}
    </div>
  );
};

export default ProductRating;