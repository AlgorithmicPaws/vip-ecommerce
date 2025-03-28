import React from 'react';
import SearchFilters from '../subcomponents/SearchFilters';
import ProductRow from '../subcomponents/ProductRow';
import LoadingIndicator from '../subcomponents/LoadingIndicator';

const ProductsTable = ({ 
  products, 
  loading, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onSearchChange,
  onCategoryChange,
  categories,
  searchTerm,
  categoryFilter
}) => {
  return (
    <div className="products-section">
      <div className="content-actions">
        <SearchFilters 
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          categories={categories}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
        />
        <button 
          className="add-product-btn"
          onClick={onAddProduct}
        >
          Añadir Producto
        </button>
      </div>
      
      <div className="products-table-container">
        {loading ? (
          <LoadingIndicator message="Cargando productos..." />
        ) : products.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductRow 
                  key={product.id}
                  product={product}
                  onEdit={() => onEditProduct(product)}
                  onDelete={() => onDeleteProduct(product)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-products">
            No se encontraron productos que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;