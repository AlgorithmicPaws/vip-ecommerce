import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="category-filter">
      <select 
        value={selectedCategory} 
        onChange={handleCategoryChange}
        aria-label="Categorías de productos"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;