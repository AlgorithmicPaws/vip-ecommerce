import React from 'react';
import { Link } from 'react-router-dom';
import CategoryFilter from '../subcomponents/CategoryFilter';
import PriceFilter from '../subcomponents/PriceFilter';
import SellerFilter from '../subcomponents/SellerFilter';
import '../../../styles/ProductCatalog.css';

const CatalogSidebar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onPriceChange, 
  onSellerChange 
}) => {
  return (
    <aside className="catalog-sidebar">
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <PriceFilter 
        onPriceChange={onPriceChange}
      />
      
      <SellerFilter 
        onSellerChange={onSellerChange}
      />
      
      {/* Popular brands section */}
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