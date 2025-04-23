// src/pages/ProductCatalog/ProductCatalog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css';
import * as productService from '../../services/productService';

// Import main layout components
import Navbar from '../../layouts/Navbar'; // <--- Import Navbar
import Footer from '../../layouts/Footer'; // <--- Import Footer

// Import existing catalog components
// import CatalogHeader from './components/CatalogHeader'; // <-- Decide if needed
import CatalogSidebar from './components/CatalogSidebar';
import CatalogContent from './components/CatalogContent';
// import CatalogFooter from './components/CatalogFooter'; // <-- Decide if needed
import ProductDetailModal from './components/ProductDetailModal';
import Pagination from './components/Pagination';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // ... (keep existing states and effects) ...
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sellerFilter, setSellerFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // ... (keep existing effects and handlers) ...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    const page = params.get('page');

    if (category) setCategoryFilter(category);
    if (search) setSearchTerm(search);
    if (page) setCurrentPage(parseInt(page) || 1);
  }, [location.search]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesResponse = await productService.getCategories();
        const transformedCategories = productService.transformApiCategories(categoriesResponse);
        setCategories(transformedCategories.map(cat => cat.name));

        const options = {};
        if (categoryFilter) {
          const categoryId = transformedCategories.find(cat => cat.name === categoryFilter)?.id;
          if (categoryId) options.categoryId = categoryId;
        }

        const productsData = await productService.getAllProducts(options);
        setProducts(productsData);
        applyFilters(productsData);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryFilter]);


  const applyFilters = (productsToFilter = products) => {
    let filtered = [...productsToFilter];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    if (priceFilter.min && !isNaN(priceFilter.min)) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceFilter.min));
    }
    if (priceFilter.max && !isNaN(priceFilter.max)) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceFilter.max));
    }
    if (sellerFilter.length > 0) {
      filtered = filtered.filter(product => sellerFilter.includes(product.seller));
    }
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    setCurrentPage(1);
  };


   useEffect(() => {
     applyFilters();
   }, [searchTerm, priceFilter, sellerFilter, products]); // Added products dependency

  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setDisplayedProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    if (addedToCartMessage.show) {
      const timer = setTimeout(() => {
        setAddedToCartMessage({ show: false, productId: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addedToCartMessage]);

   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
     const params = new URLSearchParams(location.search);
     params.set('page', pageNumber);
     navigate(`<span class="math-inline">\{location\.pathname\}?</span>{params.toString()}`);
     window.scrollTo(0, 0);
   };

   const handleSearchChange = (term) => {
     setSearchTerm(term);
   };

   const handleCategoryChange = (category) => {
     setCategoryFilter(category);
     const params = new URLSearchParams(location.search);
     if (category) {
        params.set('category', category);
     } else {
        params.delete('category');
     }
     navigate(`<span class="math-inline">\{location\.pathname\}?</span>{params.toString()}`);
   };

   const handlePriceChange = (min, max) => {
     setPriceFilter({ min, max });
   };

   const handleSellerChange = (sellers) => {
     setSellerFilter(sellers);
   };

    const handleProductClick = (product) => {
      // Option 1: Navigate to Product Detail Page
      navigate(`/catalog/product/${product.id}`);

      // Option 2: Show Modal (keep original logic if preferred)
      // setSelectedProduct(product);
      // setProductQuantity(1);
      // setShowDetailModal(true);
    };


    const handleAddToCart = (e, product) => {
      e.stopPropagation();
      addToCart(product, 1);
      setAddedToCartMessage({ show: true, productId: product.id });
    };

    const handleGoToCart = () => {
      navigate('/cart');
    };

    const handleQuantityChange = (operation) => {
      if (operation === 'increase' && productQuantity < selectedProduct.stock) {
        setProductQuantity(prev => prev + 1);
      } else if (operation === 'decrease' && productQuantity > 1) {
        setProductQuantity(prev => prev - 1);
      }
    };

    const handleAddToCartFromModal = () => {
      addToCart(selectedProduct, productQuantity);
      setShowDetailModal(false);
      setAddedToCartMessage({ show: true, productId: selectedProduct.id });
    };

    const handleBuyNow = () => {
      addToCart(selectedProduct, productQuantity);
      setShowDetailModal(false);
      navigate('/cart');
    };

    const handleCloseModal = () => {
      setShowDetailModal(false);
    };


  return (
    <div className="catalog-page-wrapper"> {/* Optional: Add a wrapper div */}
      <Navbar /> {/* <--- Add Navbar */}

      <div className="catalog-container">
        {/* Removed CatalogHeader */}

        <div className="catalog-main">
          <CatalogSidebar
            categories={categories}
            selectedCategory={categoryFilter}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onSellerChange={handleSellerChange}
          />

          <div className="catalog-content-wrapper">
            <CatalogContent
              products={displayedProducts}
              loading={loading}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              addedToCartMessage={addedToCartMessage}
              error={error}
              totalProducts={filteredProducts.length}
            />

            {!loading && filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>

        {/* Removed CatalogFooter */}
      </div>

      {/* Keep ProductDetailModal if you still want modal functionality */}
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

      <Footer /> {/* <--- Add Footer */}
    </div>
  );
};

export default ProductCatalog;