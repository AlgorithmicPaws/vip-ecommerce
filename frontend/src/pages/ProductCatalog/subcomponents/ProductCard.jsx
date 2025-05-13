// src/pages/ProductCatalog/subcomponents/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../pages/CartContext';

// --- Accept both handlers ---
const ProductCard = ({ product, onNavigateToDetail, onOpenModal, showAddedMessage }) => {
  const navigate = useNavigate();
  const { isInCart, getItemQuantity } = useCart();

  // --- Event Handlers ---

  // --- Card click NAVIGATES ---
  const handleCardClick = (e) => {
    // Prevent navigation if a button inside the card was clicked
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    // Call the navigation handler passed from parent
    if (onNavigateToDetail) {
      onNavigateToDetail(product);
    } else {
      // Fallback navigation if no handler provided
      navigate(`/catalog/product/${product.id}`);
    }
  };

  // --- "Add to Cart" button calls onOpenModal ---
  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click handler
    if (onOpenModal) {
      onOpenModal(product); // Call modal opener
    }
  };

  // --- "View Cart" button navigates to cart ---
  const handleViewCartClick = (e) => {
    e.stopPropagation(); // Prevent card click handler
    navigate('/cart');
  };

  // --- "Ver Detalles" button calls onNavigateToDetail ---
  const handleViewDetailsClick = (e) => {
    e.stopPropagation(); // Prevent card click handler
    if (onNavigateToDetail) {
      onNavigateToDetail(product); // Call navigation handler
    } else {
       // Fallback navigation if no handler provided
       if (product && product.id) {
           navigate(`/catalog/product/${product.id}`);
       }
    }
  };


  // --- Helper Functions ---
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '$ 0';
    try { return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0, minimumFractionDigits: 0 }); }
    catch (error) { console.error('Error formatting price:', error); return '$ ' + Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  };

  // --- Render Logic ---
  if (!product || !product.id) return null;

  const isProductInCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div
      className="product-card"
      onClick={handleCardClick} // Main card click now navigates
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* Product Image Section */}
      <div className="product-image">
        {product.image ? ( <img src={product.image} alt={product.name} loading="lazy" /> ) : ( <div className="image-placeholder"><span>{product.name ? product.name.charAt(0) : '?'}</span></div> )}
        {product.stock !== undefined && product.stock > 0 && product.stock < 10 && ( <div className="stock-badge">¡Pocas unidades!</div> )}
        {showAddedMessage && ( <div className="cart-message">¡Añadido al carrito!</div> )}
      </div>

      {/* Product Information Section */}
      <div className="product-info">
        <p className="product-category">{product.category || 'Sin categoría'}</p>
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <div className="product-seller">
          <span className="seller-label">Vendido por:</span>
          <span className="seller-name">{product.seller || "Desconocido"}</span>
        </div>
        <p className="product-price">{formatPrice(product.price)}</p>

        {/* Action Buttons Area */}
        <div className="product-actions">
          {isProductInCart ? (
            <div className="in-cart-info">
              <button className="view-cart-btn" onClick={handleViewCartClick} aria-label="Ver carrito de compras">
                Ver Carrito ({cartQuantity})
              </button>
            </div>
          ) : (
            // --- "Add to Cart" button uses handleAddToCartClick (opens modal) ---
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCartClick} // Calls the modal opener
              disabled={product.stock === 0}
              aria-label={`Ver opciones para añadir ${product.name} al carrito`}
            >
              {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
            </button>
          )}
          {/* --- "Ver Detalles" button uses handleViewDetailsClick (navigates) --- */}
          <button
            className="view-details-btn"
            onClick={handleViewDetailsClick} // Navigates directly
            aria-label={`Ver detalles de ${product.name}`}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
