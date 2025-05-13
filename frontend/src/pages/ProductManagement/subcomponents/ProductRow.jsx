import React from 'react';

const ProductRow = ({ product, onEdit, onDelete }) => {
  // Ensure price is a number before using toFixed
  const formatPrice = (price) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number before using toFixed
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>
        <div className="product-image-small">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              style={{
                width: "60px", 
                height: "60px", 
                objectFit: "contain",
                border: "1px solid #eee",
                borderRadius: "4px"
              }}
              onError={(e) => {
                console.error("Image failed to load:", product.image);
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
              }}
            />
          ) : (
            <div className="image-placeholder" style={{
              width: "60px", 
              height: "60px", 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "11px",
              color: "#666"
            }}>
              <span>Sin imagen</span>
            </div>
          )}
        </div>
      </td>
      <td>{product.name}</td>
      <td>${formatPrice(product.price)}</td>
      <td>{product.stock}</td>
      <td>{product.category || 'Sin categoría'}</td>
      <td>
        <div className="action-buttons">
          <button 
            className="edit-btn-sm"
            onClick={onEdit}
            style={{
              backgroundColor: '#F2A900',
              color: '#000',
              fontWeight: '600',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Editar
          </button>
          <button 
            className="delete-btn-sm"
            onClick={onDelete}
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              fontWeight: '600',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;