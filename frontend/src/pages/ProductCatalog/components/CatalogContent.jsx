import React from 'react';
import ProductCard from '../subcomponents/ProductCard';
import LoadingIndicator from '../subcomponents/LoadingIndicator';

const CatalogContent = ({ products, loading, onProductClick, onAddToCart, addedToCartMessage }) => {
  return (
    <main className="catalog-content">
      <div className="catalog-heading">
        <h1>Productos de Construcción</h1>
        <div className="view-options">
          <button className="view-btn active">
            <span className="grid-icon">□□□</span>
          </button>
          <button className="view-btn">
            <span className="list-icon">≡</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator message="Cargando productos..." />
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              showAddedMessage={addedToCartMessage.show && addedToCartMessage.productId === product.id}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      )}
    </main>
  );
};

export default CatalogContent;