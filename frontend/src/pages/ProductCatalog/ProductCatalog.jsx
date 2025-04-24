// src/pages/ProductCatalog/ProductCatalog.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css'; // Keep existing CSS import
import * as productService from '../../services/productService';

// Import main layout components
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';

// Import existing catalog components
import CatalogSidebar from './components/CatalogSidebar';
import CatalogContent from './components/CatalogContent';
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
  const [categoryFilter, setCategoryFilter] = useState(''); // Selected category NAME
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sellerFilter, setSellerFilter] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30); // Or your desired number
  const [totalPages, setTotalPages] = useState(1);

  // --- Effects ---

  // Effect 1: Fetch categories once on mount
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

    // Only run fetch if categories have been loaded
    if (categories.length > 0 || !categoryFilter) { // Fetch if categories are ready OR if no category is selected
       loadProducts();
    }

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


  // --- Handlers ---

  // Called by CategoryFilter component
  const handleCategoryChange = (newCategoryName) => {
    // Update state immediately
    setCategoryFilter(newCategoryName);

    // Update URL without full page reload
    const params = new URLSearchParams(location.search);
    if (newCategoryName) {
      params.set('category', newCategoryName);
    } else {
      params.delete('category');
    }
    // Reset page param when category changes
    params.set('page', '1');
    // Use navigate to update URL query string. Should NOT redirect to home.
    navigate(`${location.pathname}?${params.toString()}`, { replace: true }); // Use replace to avoid history buildup
  };

  const handleSearchChange = (term) => {
     setSearchTerm(term);
     // Optionally update URL for search term as well
     // const params = new URLSearchParams(location.search);
     // params.set('search', term);
     // params.set('page', '1');
     // navigate(`${location.pathname}?${params.toString()}`, { replace: true });
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

  // Modal Handlers (keep if using modal)
  const handleGoToCart = () => navigate('/cart');
  const handleQuantityChange = (operation) => { /* ... keep logic ... */ };
  const handleAddToCartFromModal = () => { /* ... keep logic ... */ };
  const handleBuyNow = () => { /* ... keep logic ... */ };
  const handleCloseModal = () => setShowDetailModal(false);


  // --- Render ---

  return (
    <div className="catalog-page-wrapper">
      <div className="catalog-container">
        <div className="catalog-main">
          <CatalogSidebar
            // Pass category names for display in the filter
            categories={categories.map(cat => cat.name)}
            selectedCategory={categoryFilter}
            onCategoryChange={handleCategoryChange} // Pass the handler
            onPriceChange={handlePriceChange}
            onSellerChange={handleSellerChange}
            // Pass other necessary props like sellers if dynamic
          />

          <div className="catalog-content-wrapper">
             {/* Pass search handler to CatalogContent if SearchBar is inside it */}
             {/* Or handle search input outside CatalogContent */}
             {/* <SearchBar onSearch={handleSearchChange} /> */}
            <CatalogContent
              products={displayedProducts} // Pass paginated products
              loading={loading}
              error={error}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              addedToCartMessage={addedToCartMessage}
              totalProducts={filteredProducts.length} // Show count of filtered products
              // Pass view mode state and handlers if needed
            />

            {!loading && filteredProducts.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Keep ProductDetailModal if using modal functionality */}
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
