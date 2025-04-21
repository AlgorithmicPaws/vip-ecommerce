import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css';
import * as productService from '../../services/productService';

// Import components
import CategoryFilter from './subcomponents/CategoryFilter';
import PriceFilter from './subcomponents/PriceFilter';
import RatingFilter from './subcomponents/RatingFilter';
import SellerFilter from './subcomponents/SellerFilter';
import ProductDetailModal from './components/ProductDetailModal';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  // State to store products
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
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
  
  // State for "added to cart" message
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

  // State for view mode (grid/list)
  const [viewMode, setViewMode] = useState('grid');

  // State for sort option
  const [sortOption, setSortOption] = useState('relevancia');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    
    if (category) setCategoryFilter(category);
    if (search) setSearchTerm(search);
  }, [location.search]);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First load categories
        const categoriesResponse = await productService.getCategories();
        const transformedCategories = productService.transformApiCategories(categoriesResponse);
        setCategories(transformedCategories.map(cat => cat.name));
        
        // Then load products with any applied filters
        const options = {};
        if (categoryFilter) {
          const categoryId = transformedCategories.find(
            cat => cat.name === categoryFilter
          )?.id;
          if (categoryId) options.categoryId = categoryId;
        }
        
        const productsData = await productService.getAllProducts(options);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [categoryFilter]); // Reload when category filter changes

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

  // Auto-hide "added to cart" message after 3 seconds
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

  // Handle category change
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Open product detail modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setShowDetailModal(true);
  };

  // Add product to cart from card
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent opening the modal
    addToCart(product, 1);
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

  // Add product to cart from modal
  const handleAddToCartFromModal = () => {
    addToCart(selectedProduct, productQuantity);
    setShowDetailModal(false);
    setAddedToCartMessage({ show: true, productId: selectedProduct.id });
  };

  // Buy now (goes directly to cart)
  const handleBuyNow = () => {
    addToCart(selectedProduct, productQuantity);
    setShowDetailModal(false);
    navigate('/cart');
  };

  // Close modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

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
    </div>
  );
};

export default ProductCatalog;