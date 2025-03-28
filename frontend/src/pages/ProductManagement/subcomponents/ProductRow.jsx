import React from 'react';

const ProductRow = ({ product, onEdit, onDelete }) => {
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
      <td>${product.price.toFixed(2)}</td>
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