// src/pages/ProductCatalog/components/ProductDetailModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to cart or seller page
import { useCart } from '../../../pages/CartContext'; // To check if item is in cart
// Removed ProductRating import as it's no longer used here

// Main component for the Product Detail Modal
const ProductDetailModal = ({
  product,          // The product object containing all details
  quantity,         // Current quantity selected in the modal
  onQuantityChange, // Function to handle quantity increase/decrease
  onAddToCart,      // Function to handle adding the item to the cart (from within the modal)
  onBuyNow,         // Function to handle "Buy Now" action (from within the modal)
  onClose           // Function to close the modal
}) => {
  const navigate = useNavigate();
  const { isInCart, getItemQuantity } = useCart(); // Get cart status functions

  // --- Helper Function: Format Price ---
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '$ 0';
    try {
      return price.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error formatting price:', error);
      return '$ ' + Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  };

  // --- Render Logic ---
  if (!product) {
    // Handle case where product data is missing
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Error</h2>
            <button className="close-modal" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body"><p>No se pudo cargar la información del producto.</p></div>
        </div>
      </div>
    );
  }

  const isProductInCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{product.name || 'Producto'}</h2>
          <button className="close-modal" onClick={onClose} aria-label="Cerrar modal">&times;</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="product-detail-grid">
            {/* Left Column: Image */}
            <div className="product-detail-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="image-placeholder large">
                  <span>{product.name ? product.name.charAt(0) : '?'}</span>
                </div>
              )}
            </div>

            {/* Right Column: Information & Actions */}
            <div className="product-detail-info">
              <p className="detail-category">Categoría: {product.category || 'N/A'}</p>
              <p className="detail-seller">
                Vendido por: <span className="seller-name-modal">{product.seller || 'Desconocido'}</span>
              </p>

              {/* --- RATING STARS REMOVED --- */}
              {/* <div className="detail-rating"> ... </div> */}

              <p className="detail-price">{formatPrice(product.price)}</p>
              {product.originalPrice && product.price < product.originalPrice && (
                <p className="detail-original-price">
                  Antes: <span className="original-price-value">{formatPrice(product.originalPrice)}</span>
                </p>
              )}

              <p className="detail-stock">
                {product.stock > 10 ? (
                  <span className="stock-available">✓ En stock</span>
                ) : product.stock > 0 ? (
                  <span className="stock-low">⚠ ¡Pocas unidades! ({product.stock} disponibles)</span>
                ) : (
                  <span className="stock-out">✗ Agotado</span>
                )}
              </p>

              <p className="detail-description">
                {product.description ? (product.description.substring(0, 150) + (product.description.length > 150 ? '...' : '')) : "No hay descripción disponible."}
                 <button onClick={() => navigate(`/catalog/product/${product.id}`)} className="link-button">Ver más detalles</button>
              </p>

              {/* Quantity Selector (only if in stock) */}
              {product.stock > 0 && (
                <div className="product-quantity">
                  <label htmlFor={`modal-quantity-${product.id}`}>Cantidad:</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      aria-label="Disminuir cantidad"
                    >-</button>
                    <input
                      type="number"
                      id={`modal-quantity-${product.id}`}
                      min="1"
                      max={product.stock}
                      value={quantity}
                      readOnly
                      aria-live="polite"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                      aria-label="Aumentar cantidad"
                    >+</button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="detail-actions">
                {isProductInCart ? (
                  <button
                    className="view-cart-btn-lg"
                    onClick={() => navigate('/cart')}
                  >
                    Ver Carrito ({cartQuantity} en carrito)
                  </button>
                ) : product.stock > 0 ? (
                  <>
                    {/* This button now triggers the onAddToCart passed to the modal */}
                    <button
                      className="add-to-cart-btn-lg"
                      onClick={onAddToCart}
                      aria-label={`Añadir ${quantity} ${product.name} al carrito`}
                    >
                      Añadir al Carrito
                    </button>
                    {/* Optional: Buy Now Button */}
                    {/* <button className="buy-now-btn" onClick={onBuyNow}>Comprar Ahora</button> */}
                  </>
                ) : (
                   <button className="out-of-stock-btn" disabled>Producto Agotado</button>
                )}
              </div>
            </div> {/* End product-detail-info */}
          </div> {/* End product-detail-grid */}
        </div> {/* End modal-body */}
      </div> {/* End modal-content */}
    </div> // End modal-overlay
  );
};

export default ProductDetailModal;
