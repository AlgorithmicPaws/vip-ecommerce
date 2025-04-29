// src/pages/ProductCatalog/ProductCatalog.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css';
import * as productService from '../../services/productService';
import * as sellerService from '../../services/sellerService';

// Import child components
import CatalogSidebar from './components/CatalogSidebar';
import CatalogContent from './components/CatalogContent'; // Make sure this component passes props correctly
import ProductDetailModal from './components/ProductDetailModal';
import Pagination from './components/Pagination';
import LoadingIndicator from './subcomponents/LoadingIndicator';

const ProductCatalog = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // --- State Variables ---
  const [initialProducts, setInitialProducts] = useState([]);
  const [productsWithSellers, setProductsWithSellers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [sellerMap, setSellerMap] = useState({});
  const [allSellersForFilter, setAllSellersForFilter] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [loadingFilterData, setLoadingFilterData] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [sellerFilter, setSellerFilter] = useState([]);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);

  // UI State
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(1);

  // --- Effects (Keep existing effects 1-7 as they are correct for data fetching/filtering/pagination) ---
  // Effect 1: Fetch static filter data
  useEffect(() => {
    const loadFilterData = async () => { setLoadingFilterData(true); setError(null); try { const [cats, sells] = await Promise.all([productService.getCategories(), sellerService.getAllSellers()]); setCategories(productService.transformApiCategories(cats) || []); setAllSellersForFilter(sells || []); } catch (err) { console.error('Error loading filter data:', err); setError('Error al cargar filtros.'); } finally { setLoadingFilterData(false); } }; loadFilterData();
   }, []);
  // Effect 2: Read URL Filters
   useEffect(() => { const params = new URLSearchParams(location.search); setCategoryFilter(params.get('category') || ''); setSearchTerm(params.get('search') || ''); setCurrentPage(parseInt(params.get('page') || '1', 10)); }, [location.search]);
  // Effect 3: Fetch initial products
  useEffect(() => { if (categoryFilter && categories.length === 0) return; const loadProds = async () => { setLoadingProducts(true); setLoadingSellers(true); setError(null); setInitialProducts([]); setProductsWithSellers([]); setSellerMap({}); try { const catObj = categories.find(c => c.name === categoryFilter); const catId = catObj ? catObj.id : null; const opts = catId ? { categoryId: catId } : {}; const prods = await productService.getAllProducts(opts); setInitialProducts(prods || []); if (prods?.length > 0) { const ids = [...new Set(prods.map(p => p.sellerId).filter(id => id != null))]; if (ids.length > 0) { const sells = await Promise.all(ids.map(id => sellerService.getSellerById(id))); const map = {}; sells.forEach(s => { if (s?.seller_id) map[s.seller_id] = s.business_name || "Desconocido"; }); setSellerMap(map); } else setSellerMap({}); } else setSellerMap({}); } catch (err) { console.error('Err loading prods:', err); setError('Err cargando prods.'); setInitialProducts([]); setSellerMap({}); } finally { setLoadingProducts(false); } }; loadProds(); }, [categoryFilter, categories]);
  // Effect 4: Combine products & sellers
  useEffect(() => { if (!loadingProducts) { const combined = initialProducts.map(p => ({ ...p, seller: sellerMap[p.sellerId] || "Desconocido" })); setProductsWithSellers(combined); setLoadingSellers(false); } }, [initialProducts, sellerMap, loadingProducts]);
  // Effect 5: Apply filters
  const applyFilters = useCallback(() => { let f = [...productsWithSellers]; if (searchTerm) { const sL = searchTerm.toLowerCase(); f = f.filter(p => p.name?.toLowerCase().includes(sL) || p.description?.toLowerCase().includes(sL) || p.seller?.toLowerCase().includes(sL)); } if (priceFilter.min) f = f.filter(p => p.price >= parseFloat(priceFilter.min)); if (priceFilter.max) f = f.filter(p => p.price <= parseFloat(priceFilter.max)); if (sellerFilter.length > 0) { const sIdSet = new Set(sellerFilter.map(String)); f = f.filter(p => p.sellerId && sIdSet.has(String(p.sellerId))); } setFilteredProducts(f); }, [productsWithSellers, searchTerm, priceFilter, sellerFilter]);
  useEffect(() => { if (!loadingSellers) applyFilters(); }, [applyFilters, loadingSellers]);
  // Effect 6: Paginate
  useEffect(() => { const total = Math.ceil(filteredProducts.length / productsPerPage); const validTp = total > 0 ? total : 1; setTotalPages(validTp); const newCp = Math.max(1, Math.min(currentPage, validTp)); if (currentPage !== newCp) { setCurrentPage(newCp); const params = new URLSearchParams(location.search); params.set('page', newCp); navigate(`${location.pathname}?${params.toString()}`, { replace: true }); } const iLast = newCp * productsPerPage; const iFirst = iLast - productsPerPage; setDisplayedProducts(filteredProducts.slice(iFirst, iLast)); }, [filteredProducts, currentPage, productsPerPage, location.search, navigate]);
  // Effect 7: Cart Message Timeout
  useEffect(() => { let timer; if (addedToCartMessage.show) timer = setTimeout(() => setAddedToCartMessage({ show: false, productId: null }), 3000); return () => clearTimeout(timer); }, [addedToCartMessage]);


  // --- Event Handlers ---

  // Handler to NAVIGATE to detail page
  // Triggered by card background click or "Ver Detalles" button
  const handleNavigateToDetail = useCallback((product) => {
    console.log("Attempting to navigate to detail for:", product?.id); // Debug log
    if (product && product.id) {
        navigate(`/catalog/product/${product.id}`);
    } else {
        console.error("handleNavigateToDetail called with invalid product:", product);
    }
  }, [navigate]); // Include navigate in dependency array

  // Handler to OPEN THE MODAL
  // Triggered ONLY by "Añadir al Carrito" button on card
  const handleOpenModal = useCallback((product) => {
    console.log("Attempting to open modal for:", product?.id); // Debug log
    if (product && product.id) {
        setSelectedProduct(product);
        setProductQuantity(1);
        setShowDetailModal(true);
    } else {
        console.error("handleOpenModal called with invalid product:", product);
    }
  }, []); // No dependencies needed if only setting state

  // Filter/Pagination Handlers
  const handleCategoryChange = (newCategoryName) => { setCategoryFilter(newCategoryName); setCurrentPage(1); const params = new URLSearchParams(location.search); if (newCategoryName) params.set('category', newCategoryName); else params.delete('category'); params.set('page', '1'); navigate(`${location.pathname}?${params.toString()}`, { replace: true }); };
  const handleSearchChange = (term) => { setSearchTerm(term); setCurrentPage(1); };
  const handlePriceChange = (min, max) => { setPriceFilter({ min, max }); setCurrentPage(1); };
  const handleSellerChange = (selectedSellerIds) => { setSellerFilter(selectedSellerIds); setCurrentPage(1); };
  const handlePageChange = (pageNumber) => { if (pageNumber >= 1 && pageNumber <= totalPages) { setCurrentPage(pageNumber); const params = new URLSearchParams(location.search); params.set('page', pageNumber); navigate(`${location.pathname}?${params.toString()}`, { replace: true }); window.scrollTo(0, 0); } };

  // --- Modal Specific Handlers ---
  const handleQuantityChange = (operation) => { if (!selectedProduct) return; if (operation === 'increase' && productQuantity < selectedProduct.stock) setProductQuantity(prev => prev + 1); else if (operation === 'decrease' && productQuantity > 1) setProductQuantity(prev => prev - 1); };
  const handleAddToCartFromModal = () => { if (selectedProduct) { addToCart(selectedProduct, productQuantity); setAddedToCartMessage({ show: true, productId: selectedProduct.id }); setShowDetailModal(false); } };
  const handleBuyNow = () => { if (selectedProduct) { addToCart(selectedProduct, productQuantity); navigate('/cart'); } };
  const handleCloseModal = () => setShowDetailModal(false);

  // --- Derived State ---
  const isLoading = loadingProducts || loadingSellers || loadingFilterData;
  const categoryNames = useMemo(() => categories.map(cat => cat.name), [categories]);

  // --- Render ---
  return (
    <div className="catalog-page-wrapper">
      <div className="catalog-container">
        <div className="catalog-main">
          {/* Sidebar */}
          <CatalogSidebar
            categories={categoryNames}
            sellers={allSellersForFilter}
            selectedCategory={categoryFilter}
            selectedSellers={sellerFilter}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onSellerChange={handleSellerChange}
            isLoading={loadingFilterData}
          />
          {/* Main Content */}
          <div className="catalog-content-wrapper">
            <CatalogContent
              products={displayedProducts}
              loading={isLoading}
              error={error}
              // --- Pass BOTH handlers ---
              onNavigateToDetail={handleNavigateToDetail} // For card background & "Ver Detalles" btn
              onOpenModal={handleOpenModal}             // For "Añadir al Carrito" btn
              // --- End Passing Handlers ---
              addedToCartMessage={addedToCartMessage}
              totalProducts={filteredProducts.length}
            />
            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>

      {/* Modal Rendering */}
      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          quantity={productQuantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCartFromModal} // Pass the correct handler
          onBuyNow={handleBuyNow}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
