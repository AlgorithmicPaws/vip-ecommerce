// frontend/src/pages/Admin/components/OrdersFilter.jsx
import React from 'react';

const OrdersFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange
}) => {
  // Opciones de estado de pedido
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'processing', label: 'En proceso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'refunded', label: 'Reembolsado' }
  ];
  
  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'total_asc', label: 'Total (Menor a Mayor)' },
    { value: 'total_desc', label: 'Total (Mayor a Menor)' }
  ];
  
  // Manejar cambios en el rango de fechas
  const handleFromDateChange = (e) => {
    onDateRangeChange({ ...dateRange, from: e.target.value });
  };
  
  const handleToDateChange = (e) => {
    onDateRangeChange({ ...dateRange, to: e.target.value });
  };
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('');
    onDateRangeChange({ from: '', to: '' });
    onSortChange('newest');
  };

  return (
    <div className="filter-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por # de pedido o cliente..."
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
          <label htmlFor="date-from">Desde:</label>
          <input
            type="date"
            id="date-from"
            value={dateRange.from}
            onChange={handleFromDateChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="date-to">Hasta:</label>
          <input
            type="date"
            id="date-to"
            value={dateRange.to}
            onChange={handleToDateChange}
          />
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
        {(searchQuery || statusFilter || dateRange.from || dateRange.to || sortBy !== 'newest') && (
          <button 
            className="clear-filters-btn"
            onClick={clearAllFilters}
          >
            Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;