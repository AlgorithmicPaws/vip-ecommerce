import React from 'react';
import CategoryFilter from '../subcomponents/CategoryFilter';
import PriceFilter from '../subcomponents/PriceFilter';
import SellerFilter from '../subcomponents/SellerFilter';
import RatingFilter from '../subcomponents/RatingFilter';

const CatalogSidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <aside className="catalog-sidebar">
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <PriceFilter />
      
      <SellerFilter />
      
      <RatingFilter />
    </aside>
  );
};

export default CatalogSidebar;