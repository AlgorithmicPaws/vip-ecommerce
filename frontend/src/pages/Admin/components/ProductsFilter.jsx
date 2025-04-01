// frontend/src/pages/Admin/components/ProductsFilter.jsx
import React from 'react';

const ProductsFilter = ({
  searchQuery,
  onSearchChange,
  categories,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange
}) => {
  // Opciones de estado de producto
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'out_of_stock', label: 'Sin stock' },
    { value: 'disabled', label: 'Desactivado' }
  ];
  
  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'name_asc', label: 'Nombre (A-Z)' },
    { value: 'name_desc', label: 'Nombre (Z-A)' },
    { value: 'price_asc', label: 'Precio (Menor a Mayor)' },
    { value: 'price_desc', label: 'Precio (Mayor a Menor)' },
    { value: 'stock_asc', label: 'Stock (Menor a Mayor)' },
    { value: 'stock_desc', label: 'Stock (Mayor a Menor)' }
  ];

  return (
    <div className="filter-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="search-btn">
          🔍
        </button>
        {searchQuery && (
          <button 
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="filter-selects">
        <div className="filter-group">
          <label htmlFor="category-filter">Categoría:</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {statusOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-by">Ordenar por:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="filter-btn">
          <span className="btn-icon">⚙️</span> Filtros Avanzados
        </button>
        <button className="clear-filters-btn">
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default ProductsFilter;