// src/pages/ProductCatalog/components/CatalogSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryFilter from '../subcomponents/CategoryFilter'; // Displays category names
import PriceFilter from '../subcomponents/PriceFilter';       // Handles price range
import SellerFilter from '../subcomponents/SellerFilter';    // Displays seller names, handles ID selection
import LoadingIndicator from '../subcomponents/LoadingIndicator'; // Shows loading state
import '../../../styles/ProductCatalog.css'; // Styles for the sidebar

const CatalogSidebar = ({
  categories,        // Array of category names: ['Category A', 'Category B']
  sellers,           // Array of seller objects: [{ seller_id: 1, business_name: 'Seller X' }, ...]
  selectedCategory,  // Currently selected category name (string)
  selectedSellers,   // Array of currently selected seller IDs: [1, 5, 10]
  onCategoryChange,  // Function to call when category selection changes (passes name)
  onPriceChange,     // Function to call when price range changes (passes min, max)
  onSellerChange,    // Function to call when seller selection changes (passes array of IDs)
  isLoading          // Boolean indicating if filter data (categories, sellers) is loading
}) => {
  return (
    <aside className="catalog-sidebar">
      {/* Show loading indicator if filter data is not ready */}
      {isLoading ? (
        <LoadingIndicator message="Cargando filtros..." />
      ) : (
        <>
          {/* Category Filter Component */}
          <CategoryFilter
            categories={categories}             // Pass the list of category names
            selectedCategory={selectedCategory} // Pass the current selection
            onCategoryChange={onCategoryChange} // Pass the handler function
          />

          {/* Price Filter Component */}
          <PriceFilter
            onPriceChange={onPriceChange} // Pass the handler function
          />

          {/* Seller Filter Component */}
          <SellerFilter
            sellers={sellers}                 // Pass the full list of seller objects
            selectedSellers={selectedSellers} // Pass the array of selected seller IDs
            onSellerChange={onSellerChange}   // Pass the handler function (expects IDs)
          />
        </>
      )}
    </aside>
  );
};

export default CatalogSidebar;
