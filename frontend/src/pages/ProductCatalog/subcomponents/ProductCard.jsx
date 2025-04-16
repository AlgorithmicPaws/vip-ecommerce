import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../pages/CartContext';
import ProductRating from './ProductRating';

const ProductCard = ({ product, onProductClick, onAddToCart, showAddedMessage }) => {
  const navigate = useNavigate();
  const { isInCart, getItemQuantity } = useCart();

  const handleCardClick = (e) => {
    // Avoid opening modal if clicked on a button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    onProductClick(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the modal
    onAddToCart(e, product);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <div 
      className="product-card"
      onClick={handleCardClick}
    >
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">
            <span>{product.name.charAt(0)}</span>
          </div>
        )}
        {product.stock < 10 && (
          <div className="stock-badge">¡Pocas unidades!</div>
        )}
        {showAddedMessage && (
          <div className="cart-message">¡Añadido al carrito!</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-seller">Vendido por: {product.seller}</p>
        <ProductRating rating={product.rating} showNumber />
        <p className="product-price">${formatPrice(product.price)}</p>
        <div className="product-actions">
          {isInCart(product.id) ? (
            <div className="in-cart-info">
              <span className="in-cart-text">En carrito: {getItemQuantity(product.id)}</span>
              <button 
                className="view-cart-btn"
                onClick={handleViewCart}
              >
                Ver Carrito
              </button>
            </div>
          ) : (
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Añadir al Carrito
            </button>
          )}
          <button className="view-details-btn">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;