// frontend/src/pages/Admin/components/ProductsTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductsTable = ({
  products,
  loading,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onDelete
}) => {
  // Renderizar estado del producto con etiqueta de color
  const renderStatus = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Activo</span>;
      case 'out_of_stock':
        return <span className="status-badge out-of-stock">Sin Stock</span>;
      case 'disabled':
        return <span className="status-badge disabled">Desactivado</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Renderizar el precio con formato
  const renderPrice = (price, originalPrice) => {
    const hasDiscount = originalPrice > price;
    
    return (
      <div className="price-display">
        <span className="current-price">${price.toFixed(2)}</span>
        {hasDiscount && (
          <span className="original-price">${originalPrice.toFixed(2)}</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-table-message">
        <p>No se encontraron productos con los filtros actuales.</p>
        <button className="clear-filters-btn">Limpiar Filtros</button>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="admin-table products-table">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th className="image-cell">Imagen</th>
            <th className="product-cell">Producto</th>
            <th>SKU</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Vendedor</th>
            <th>Añadido</th>
            <th className="actions-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => onSelectProduct(product.id)}
                />
              </td>
              <td className="image-cell">
                <div className="product-thumbnail">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">
                      <span>{product.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="product-cell">
                <Link to={`/admin/products/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                {product.featured && (
                  <span className="featured-badge">Destacado</span>
                )}
              </td>
              <td>{product.sku}</td>
              <td>{renderPrice(product.price, product.originalPrice)}</td>
              <td className="stock-cell">
                <span className={`stock-value ${product.stock <= 10 ? 'low-stock' : ''}`}>
                  {product.stock}
                </span>
              </td>
              <td>{product.category}</td>
              <td>{renderStatus(product.status)}</td>
              <td>{product.seller}</td>
              <td>{product.dateAdded}</td>
              <td className="actions-cell">
                <div className="row-actions">
                  <Link to={`/admin/products/${product.id}`} className="action-btn view" title="Ver detalles">
                    👁️
                  </Link>
                  <Link to={`/admin/products/${product.id}/edit`} className="action-btn edit" title="Editar producto">
                    ✏️
                  </Link>
                  <button className="action-btn delete" title="Eliminar producto" onClick={() => onDelete(product)}>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;