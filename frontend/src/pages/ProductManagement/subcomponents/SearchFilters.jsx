import React, { useState } from 'react';
import AddCategory from './AddCategory'; // Adjust the import path as necessary

const SearchFilters = ({ 
  searchTerm, 
  categoryFilter, 
  categories, 
  onSearchChange, 
  onCategoryChange,
  onAddProduct
}) => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const handleAddCategoryClick = () => {
    setIsAddCategoryOpen(true);
  };

  const handleCloseAddCategory = () => {
    setIsAddCategoryOpen(false);
  };

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

      <button className="add-category-btn" onClick={handleAddCategoryClick}>
          Añadir Categoría
        </button>
        <button className="add-product-btn" onClick={onAddProduct}>
          Añadir Producto
        </button>
        {isAddCategoryOpen && <AddCategory onClose={handleCloseAddCategory} />}
    </div>
  );
};

export default SearchFilters;