import React, { useState } from 'react';

const SearchFilters = ({ 
  searchTerm, 
  categoryFilter, 
  categories, 
  onSearchChange, 
  onCategoryChange 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearchTerm);
  };

  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={localSearchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit" className="search-btn">Buscar</button>
        </form>
      </div>
      <div className="category-filter">
        <select 
          value={categoryFilter} 
          onChange={handleCategoryChange}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;