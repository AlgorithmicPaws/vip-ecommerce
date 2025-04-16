import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css';
import * as productService from '../../services/productService';

// Import components
import CatalogHeader from './components/CatalogHeader';
import CatalogSidebar from './components/CatalogSidebar';
import CatalogContent from './components/CatalogContent';
import CatalogFooter from './components/CatalogFooter';
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
  
  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  
  // State for "added to cart" message
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

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

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Auto-hide "added to cart" message after 3 seconds
  useEffect(() => {
    if (addedToCartMessage.show) {
      const timer = setTimeout(() => {
        setAddedToCartMessage({ show: false, productId: null });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [addedToCartMessage]);

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
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

  // Go to cart
  const handleGoToCart = () => {
    navigate('/cart');
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

  return (
    <div className="catalog-container">
      <CatalogHeader 
        onSearch={handleSearchChange} 
        onGoToCart={handleGoToCart} 
      />
      
      <div className="catalog-main">
        <CatalogSidebar 
          categories={categories}
          selectedCategory={categoryFilter}
          onCategoryChange={handleCategoryChange}
        />
        
        <CatalogContent 
          products={filteredProducts}
          loading={loading}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          addedToCartMessage={addedToCartMessage}
          error={error}
        />
      </div>
      
      <CatalogFooter />
      
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