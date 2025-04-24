import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="filter-section">
      <h3>Categorías</h3>
      <div className="category-filter">
        <select 
          value={selectedCategory} 
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

export default CategoryFilter;