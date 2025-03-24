import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import '../../styles/ProductCatalog.css';

// Importamos los componentes 
import CatalogHeader from './components/CatalogHeader';
import CatalogSidebar from './components/CatalogSidebar';
import CatalogContent from './components/CatalogContent';
import CatalogFooter from './components/CatalogFooter';
import ProductDetailModal from './components/ProductDetailModal';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Estado para modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  
  // Estado para mensaje de añadido al carrito
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

  // Categorías de ejemplo
  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Construcción'];

  // Simular carga de productos
  useEffect(() => {
    // En una app real, esto sería una llamada a la API
    setTimeout(() => {
      const mockProducts = [
        { 
          id: 1, 
          name: 'Smartphone XYZ', 
          price: 499.99, 
          stock: 25, 
          category: 'Electrónica',
          description: 'Smartphone de última generación con cámara de alta resolución',
          image: null,
          seller: 'TechStore',
          rating: 4.5
        },
        // ... otros productos (puedes mantener el mismo array que tenías)
      ];

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar productos
  useEffect(() => {
    let result = [...products];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  // Auto-ocultar mensaje de "añadido al carrito" después de 3 segundos
  useEffect(() => {
    if (addedToCartMessage.show) {
      const timer = setTimeout(() => {
        setAddedToCartMessage({ show: false, productId: null });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [addedToCartMessage]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Manejar cambio en el filtro de categoría
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  // Abrir modal de detalles del producto
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setShowDetailModal(true);
  };

  // Añadir producto al carrito desde la tarjeta
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Evitar abrir el modal
    addToCart(product, 1);
    setAddedToCartMessage({ show: true, productId: product.id });
  };

  // Ir al carrito
  const handleGoToCart = () => {
    navigate('/cart');
  };

  // Manejar cambios en la cantidad de producto en el modal
  const handleQuantityChange = (operation) => {
    if (operation === 'increase' && productQuantity < selectedProduct.stock) {
      setProductQuantity(prev => prev + 1);
    } else if (operation === 'decrease' && productQuantity > 1) {
      setProductQuantity(prev => prev - 1);
    }
  };

  // Añadir producto al carrito desde el modal
  const handleAddToCartFromModal = () => {
    addToCart(selectedProduct, productQuantity);
    setShowDetailModal(false);
    setAddedToCartMessage({ show: true, productId: selectedProduct.id });
  };

  // Comprar ahora (va directamente al carrito)
  const handleBuyNow = () => {
    addToCart(selectedProduct, productQuantity);
    setShowDetailModal(false);
    navigate('/cart');
  };

  // Cerrar modal
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