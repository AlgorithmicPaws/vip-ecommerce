import React, { useState } from 'react';
import ProductCard from '../subcomponents/ProductCard';
import LoadingIndicator from '../subcomponents/LoadingIndicator';

const CatalogContent = ({ products, loading, error, onProductClick, onAddToCart, addedToCartMessage, onSearch }) => {
  return (
    <main className="catalog-content">
      <div className="catalog-heading">
        <div className="heading-info">
          <h1>Productos de Construcción</h1>
          {!loading && !error && (
            <p className="results-count">
              Mostrando {products.length} de {totalProducts} productos
            </p>
          )}
        </div>
        <div className="view-options">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => toggleViewMode('grid')}
            aria-label="Ver en cuadrícula"
          >
            <span className="grid-icon">□□□</span>
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => toggleViewMode('list')}
            aria-label="Ver en lista"
          >
            <span className="list-icon">≡</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator message="Cargando productos..." />
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
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
          <div className="no-products-icon">🔍</div>
          <h2>No se encontraron productos</h2>
          <p>Intenta modificar los filtros de búsqueda para encontrar lo que necesitas.</p>
        </div>
      )}
    </main>
  );
};

export default CatalogContent;