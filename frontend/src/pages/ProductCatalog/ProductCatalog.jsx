// src/pages/ProductCatalog/ProductCatalog.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css'; // Keep existing CSS import
import * as productService from '../../services/productService';

// Import components
import CategoryFilter from './subcomponents/CategoryFilter';
import PriceFilter from './subcomponents/PriceFilter';
import RatingFilter from './subcomponents/RatingFilter';
import SellerFilter from './subcomponents/SellerFilter';
import ProductDetailModal from './components/ProductDetailModal';
import Pagination from './components/Pagination';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // State Variables
  const [allProducts, setAllProducts] = useState([]); // Store the master list from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after all filters
  const [displayedProducts, setDisplayedProducts] = useState([]); // Products for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // Store categories { id, name }
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  
  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30); // Or your desired number
  const [totalPages, setTotalPages] = useState(1);

  // State for view mode (grid/list)
  const [viewMode, setViewMode] = useState('grid');

  // State for sort option
  const [sortOption, setSortOption] = useState('relevancia');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Parse query parameters
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResponse = await productService.getCategories();
        // Assuming transformApiCategories returns an array like [{ id: '1', name: 'Category A' }, ...]
        const transformedCategories = productService.transformApiCategories(categoriesResponse);
        setCategories(transformedCategories || []);
      } catch (err) {
        console.error('Error loading categories:', err);
        // Handle category loading error if needed
      }
    };
    loadCategories();
  }, []); // Empty dependency array ensures this runs only once

  // Effect 2: Read initial filters from URL
   useEffect(() => {
     const params = new URLSearchParams(location.search);
     const category = params.get('category') || ''; // Default to empty string
     const search = params.get('search') || '';
     const page = parseInt(params.get('page') || '1', 10);

     setCategoryFilter(category);
     setSearchTerm(search);
     setCurrentPage(page);
     // We fetch products in the next effect based on these states
   }, [location.search]); // Re-run if URL search params change

  // Effect 3: Fetch products when category filter changes OR on initial load
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Find the category ID based on the selected name
        const selectedCategoryObj = categories.find(cat => cat.name === categoryFilter);
        const categoryId = selectedCategoryObj ? selectedCategoryObj.id : null;

        // Prepare options for the API call
        const options = {};
        if (categoryId) {
          options.categoryId = categoryId; // Pass categoryId if selected
        }
        // Add other potential API options here if your service supports them (e.g., search term)
        // options.search = searchTerm; // Example if API supports search

        // Fetch products - ideally filtered by categoryId on the server
        const productsData = await productService.getAllProducts(options);
        setAllProducts(productsData || []); // Store the raw list fetched

      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        setAllProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

  // Filter products based on all filters
  useEffect(() => {
    if (products.length === 0) return;
    
    let filtered = [...products];
    
    // Search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Price filter
    if (minPrice !== '' && maxPrice !== '') {
      filtered = filtered.filter(
        product => product.price >= Number(minPrice) && product.price <= Number(maxPrice)
      );
    } else if (minPrice !== '') {
      filtered = filtered.filter(product => product.price >= Number(minPrice));
    } else if (maxPrice !== '') {
      filtered = filtered.filter(product => product.price <= Number(maxPrice));
    }
    
    // Seller filter
    if (selectedSellers.length > 0) {
      filtered = filtered.filter(product => selectedSellers.includes(product.seller));
    }
    
    // Rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }
    
    // Sort products
    switch (sortOption) {
      case 'precio_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'precio_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevancia':
      default:
        // No sorting, keep default order
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm, 
    categoryFilter, 
    minPrice, 
    maxPrice, 
    selectedSellers, 
    ratingFilter, 
    sortOption, 
    products
  ]);

  }, [categoryFilter, categories]); // Re-fetch when categoryFilter changes or categories load

  // Effect 4: Apply client-side filters whenever products or filter criteria change
  // Use useCallback for applyFilters to stabilize its reference if needed elsewhere
  const applyFilters = useCallback(() => {
    console.log("Applying filters. Base product count:", allProducts.length, "Filters:", { searchTerm, priceFilter, sellerFilter });
    let filtered = [...allProducts];

    // Apply Search Filter (Client-side)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply Price Filter (Client-side)
    if (priceFilter.min && !isNaN(priceFilter.min)) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceFilter.min));
    }
    if (priceFilter.max && !isNaN(priceFilter.max)) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceFilter.max));
    }

    // Apply Seller Filter (Client-side)
    if (sellerFilter.length > 0) {
      filtered = filtered.filter(product => product.seller && sellerFilter.includes(product.seller));
    }

    console.log("Filtered product count:", filtered.length);
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change

  }, [allProducts, searchTerm, priceFilter, sellerFilter]); // Dependencies for filtering

  // Run the filter function when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // applyFilters is memoized by useCallback

  // Effect 5: Paginate filtered products
  useEffect(() => {
    const total = Math.ceil(filteredProducts.length / productsPerPage);
    setTotalPages(total > 0 ? total : 1); // Ensure totalPages is at least 1

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setDisplayedProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));

  }, [filteredProducts, currentPage, productsPerPage]);

  // Effect 6: Handle "Added to Cart" message timeout
  useEffect(() => {
    if (addedToCartMessage.show) {
      const timer = setTimeout(() => {
        setAddedToCartMessage({ show: false, productId: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addedToCartMessage]);

  // Handle price filter change
  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Handle seller filter change
  const handleSellerChange = (sellers) => {
    setSelectedSellers(sellers);
  };

  // Handle rating filter change
  const handleRatingChange = (rating) => {
    setRatingFilter(rating);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSellers([]);
    setRatingFilter(null);
    setSearchTerm('');
  };

   const handlePriceChange = (min, max) => {
     setPriceFilter({ min, max });
   };

   const handleSellerChange = (sellers) => {
     setSellerFilter(sellers);
   };

   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
     // Update URL page parameter
     const params = new URLSearchParams(location.search);
     params.set('page', pageNumber);
     navigate(`${location.pathname}?${params.toString()}`, { replace: true });
     window.scrollTo(0, 0); // Scroll to top on page change
   };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Open product detail modal
  const handleProductClick = (product) => {
    // Option 1: Navigate to Product Detail Page (Recommended)
    navigate(`/product/${product.id}`); // Assuming '/product/:id' route exists

    // Option 2: Show Modal (Keep if preferred)
    // setSelectedProduct(product);
    // setProductQuantity(1);
    // setShowDetailModal(true);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click handler
    addToCart(product, 1); // Assuming quantity is 1 for catalog button
    setAddedToCartMessage({ show: true, productId: product.id });
  };

  // Handle quantity change in modal
  const handleQuantityChange = (operation) => {
    if (operation === 'increase' && productQuantity < selectedProduct.stock) {
      setProductQuantity(prev => prev + 1);
    } else if (operation === 'decrease' && productQuantity > 1) {
      setProductQuantity(prev => prev - 1);
    }
  };

  // --- Render ---

  // Toggle view mode
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="catalog-container">
      <div className="catalog-main">
        {/* Sidebar con filtros */}
        <aside className="catalog-sidebar">
          <div className="filters-title">
            <h2>Filtros</h2>
            <button className="filter-clear" onClick={handleClearFilters}>
              Limpiar
            </button>
          </div>
          
          <div className="filter-section">
            <h3>Categorías</h3>
            <CategoryFilter 
              categories={categories}
              selectedCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <div className="filter-section">
            <h3>Filtrar por Precio</h3>
            <PriceFilter onPriceChange={handlePriceChange} />
          </div>
          
          <div className="filter-section">
            <h3>Vendedores</h3>
            <SellerFilter onSellerChange={handleSellerChange} />
          </div>
          
          <div className="filter-section">
            <h3>Valoración</h3>
            <RatingFilter onRatingChange={handleRatingChange} />
          </div>
          
          <div className="filter-section">
            <h3>Marcas Populares</h3>
            <div className="popular-brands">
              <a href="/brands/dewalt" className="popular-brand-link">DeWalt</a>
              <a href="/brands/bosch" className="popular-brand-link">Bosch</a>
              <a href="/brands/stanley" className="popular-brand-link">Stanley</a>
              <a href="/brands/truper" className="popular-brand-link">Truper</a>
              <a href="/brands/3m" className="popular-brand-link">3M</a>
              <a href="/brands" className="view-all-brands">Ver todas las marcas</a>
            </div>
          </div>
        </aside>
        
        {/* Contenido principal */}
        <main className="catalog-content">
          {/* Cabecera con ordenación y vistas */}
          <div className="catalog-header-bar">
            <div className="catalog-sort">
              <select 
                value={sortOption} 
                onChange={handleSortChange}
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
                <option value="rating">Mejor valorados</option>
              </select>
              <div className="results-info">
                Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
              </div>
            </div>
            
            <div className="view-options">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
                aria-label="Ver en cuadrícula"
              >
                <span className="grid-icon">□□</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
                aria-label="Ver en lista"
              >
                <span className="list-icon">≡</span>
              </button>
            </div>
          </div>
          
          {/* Productos */}
          {loading ? (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className={`products-${viewMode}`}>
              {currentProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  {product.discount > 0 && (
                    <div className="discount-badge">
                      -{product.discount}%
                    </div>
                  )}
                  
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="image-placeholder">
                        <span>{product.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-seller">{product.seller}</div>
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="product-rating">
                      {renderStars(product.rating)}
                      <span className="rating-number">{product.rating}</span>
                    </div>
                    
                    <div className="product-price">
                      ${product.price.toFixed(2)}
                      {product.discount > 0 && (
                        <span className="original-price">
                          ${(product.price * (100 / (100 - product.discount))).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Envío gratis indicator */}
                    {product.price > 100 && (
                      <div className="free-shipping">
                        <span className="free-shipping-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 .001 4 2 2 0 0 1 0-4zm-8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                          </svg>
                        </span>
                        Envío gratis
                      </div>
                    )}
                    
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
              <button onClick={handleClearFilters}>Ver todos los productos</button>
            </div>
          )}
          
          {/* Paginación */}
          {filteredProducts.length > 0 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
              
              {totalPages <= 5 ? (
                // Mostrar todos los números de página si son 5 o menos
                Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Lógica para mostrar página actual y algunas páginas alrededor
                <>
                  {currentPage > 1 && <button onClick={() => paginate(1)}>1</button>}
                  {currentPage > 3 && <span>...</span>}
                  
                  {currentPage > 2 && (
                    <button onClick={() => paginate(currentPage - 1)}>{currentPage - 1}</button>
                  )}
                  
                  <button className="active">{currentPage}</button>
                  
                  {currentPage < totalPages - 1 && (
                    <button onClick={() => paginate(currentPage + 1)}>{currentPage + 1}</button>
                  )}
                  
                  {currentPage < totalPages - 2 && <span>...</span>}
                  {currentPage < totalPages && (
                    <button onClick={() => paginate(totalPages)}>{totalPages}</button>
                  )}
                </>
              )}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          )}
        </main>
      </div>
      
      {/* Modal de detalle de producto */}
      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          quantity={productQuantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCartFromModal}
          onBuyNow={handleBuyNow}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductCatalog;
