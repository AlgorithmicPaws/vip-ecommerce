import React from 'react';
import { Link } from 'react-router-dom';
import CategoryFilter from '../subcomponents/CategoryFilter';
import PriceFilter from '../subcomponents/PriceFilter';
import SellerFilter from '../subcomponents/SellerFilter';
import RatingFilter from '../subcomponents/RatingFilter';
import '../../../styles/ProductCatalog.css';

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
      
      {/* Nueva sección para marcas */}
      <div className="filter-section">
        <h3>Marcas Populares</h3>
        <div className="popular-brands">
          <Link to="/brands/dewalt" className="popular-brand-link">DeWalt</Link>
          <Link to="/brands/bosch" className="popular-brand-link">Bosch</Link>
          <Link to="/brands/makita" className="popular-brand-link">Makita</Link>
          <Link to="/brands/stanley" className="popular-brand-link">Stanley</Link>
          <Link to="/brands" className="view-all-brands">Ver todas las marcas</Link>
        </div>
      </div>
    </aside>
  );
};

export default CatalogSidebar;