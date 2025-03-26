import React from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../subcomponents/ReviewCard';

const ReviewsTab = ({ reviews, setReviews }) => {
  // Eliminar una reseña
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  // Editar una reseña (función que se implementaría con un modal o formulario)
  const handleEditReview = (reviewId) => {
    alert(`Editar reseña ${reviewId} - Funcionalidad no implementada`);
    // Esta funcionalidad se implementaría con un modal o formulario adicional
  };

  return (
    <div className="reviews-tab">
      <div className="section-header">
        <h2>Mis Reseñas</h2>
      </div>
      
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map(review => (
            <ReviewCard 
              key={review.id}
              review={review}
              onEdit={() => handleEditReview(review.id)}
              onDelete={() => handleDeleteReview(review.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No has escrito reseñas todavía</h3>
          <p>Comparte tu opinión sobre los productos que has comprado.</p>
          <Link to="/catalog" className="action-btn">Ver Productos</Link>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;