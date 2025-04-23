import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../pages/CartContext';
import ProductRating from '../subcomponents/ProductRating';

const ProductDetailModal = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart, 
  onBuyNow, 
  onClose 
}) => {
  const navigate = useNavigate();
  const { isInCart, getItemQuantity } = useCart();



  const formatPrice = (price) => {
    // Handle invalid values
    if (typeof price !== 'number' || isNaN(price)) return '0';
    
    try {
      // Format as COP - add thousands separator (.) and no decimals
      return price.toLocaleString('es-CO', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error formatting price:', error);
      // Fallback formatting
      return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="product-detail-grid">
            <div className="product-detail-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="image-placeholder large">
                  <span>{product.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="product-detail-info">
              <p className="detail-category">Categoría: {product.category}</p>
              <p className="detail-seller">Vendido por: {product.seller}</p>
              <div className="detail-rating">
                <ProductRating rating={product.rating} showNumber />
              </div>
              <p className="detail-price">${formatPrice(product.price)}</p>
              <p className="detail-stock">
                Stock: {product.stock} unidades
                {product.stock < 10 && (
                  <span className="stock-warning"> - ¡Pocas unidades disponibles!</span>
                )}
              </p>
              <p className="detail-description">{product.description || "No hay descripción disponible para este producto."}</p>
              
              <div className="product-quantity">
                <label htmlFor="quantity">Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => onQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity" 
                    min="1" 
                    max={product.stock} 
                    value={quantity}
                    readOnly
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => onQuantityChange('increase')}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="detail-actions">
                {isInCart(product.id) ? (
                  <button 
                    className="view-cart-btn-lg"
                    onClick={() => navigate('/cart')}
                  >
                    Ver Carrito ({getItemQuantity(product.id)} en carrito)
                  </button>
                ) : (
                  <>
                    <button 
                      className="add-to-cart-btn-lg"
                      onClick={onAddToCart}
                    >
                      Añadir al Carrito
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={onBuyNow}
                    >
                      Comprar Ahora
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;