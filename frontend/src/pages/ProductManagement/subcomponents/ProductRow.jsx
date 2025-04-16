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
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="image-placeholder">
              <span>Sin imagen</span>
            </div>
          )}
        </div>
      </td>
      <td>{product.name}</td>
      <td>${formatPrice(product.price)}</td>
      <td>{product.stock}</td>
      <td>{product.category}</td>
      <td>
        <div className="action-buttons">
          <button 
            className="edit-btn-sm"
            onClick={onEdit}
          >
            Editar
          </button>
          <button 
            className="delete-btn-sm"
            onClick={onDelete}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;