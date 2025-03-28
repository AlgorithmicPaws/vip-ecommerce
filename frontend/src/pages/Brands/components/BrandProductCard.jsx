import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrandProductCard = ({ product, onAddToCart, showAddedMessage }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/catalog/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evitar que se active el click de la tarjeta
    if (onAddToCart) {
      onAddToCart(e, product);
    }
  };

  // Renderizar estrellas para el rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return <div className="product-rating">{stars}</div>;
  };

  return (
    <div className="brand-product-card" onClick={handleCardClick}>
      {/* Insignia de descuento */}
      {product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      
      {/* Imagen del producto */}
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <span>{product.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Mensaje de añadido al carrito */}
        {showAddedMessage && (
          <div className="added-to-cart-message">¡Añadido al carrito!</div>
        )}
      </div>
      
      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {/* Rating */}
        <div className="product-meta">
          {renderRatingStars(product.rating)}
          <span className="rating-value">({product.rating})</span>
        </div>
        
        {/* Precio */}
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="current-price">${product.price.toFixed(2)}</span>
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="current-price">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Botón de añadir al carrito */}
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default BrandProductCard;