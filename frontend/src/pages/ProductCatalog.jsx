import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/ProductCatalog.css';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { addToCart, totalItems, isInCart, getItemQuantity } = useCart();
  
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

  // Categorías de ejemplo (las mismas que en ProductManagement)
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
        { 
          id: 2, 
          name: 'Laptop Pro', 
          price: 1299.99, 
          stock: 10, 
          category: 'Electrónica',
          description: 'Laptop potente para trabajo profesional y gaming',
          image: null,
          seller: 'TechStore',
          rating: 4.8
        },
        { 
          id: 3, 
          name: 'Zapatillas Runner', 
          price: 89.99, 
          stock: 50, 
          category: 'Deportes',
          description: 'Zapatillas cómodas para correr largas distancias',
          image: null,
          seller: 'SportCenter',
          rating: 4.2
        },
        { 
          id: 4, 
          name: 'Camiseta Casual', 
          price: 24.99, 
          stock: 100, 
          category: 'Ropa',
          description: 'Camiseta de algodón 100%, disponible en varios colores',
          image: null,
          seller: 'FashionStyle',
          rating: 4.0
        },
        { 
          id: 5, 
          name: 'Juego de Sartenes', 
          price: 79.99, 
          stock: 15, 
          category: 'Hogar',
          description: 'Set de 3 sartenes antiadherentes de alta calidad',
          image: null,
          seller: 'HomePlus',
          rating: 4.7
        },
        { 
          id: 6, 
          name: 'Monitor UltraWide', 
          price: 349.99, 
          stock: 7, 
          category: 'Electrónica',
          description: 'Monitor curvo de 34 pulgadas con resolución 4K para una experiencia inmersiva',
          image: null,
          seller: 'TechStore',
          rating: 4.6
        },
        { 
          id: 7, 
          name: 'Martillo Profesional', 
          price: 29.99, 
          stock: 45, 
          category: 'Construcción',
          description: 'Martillo de acero con mango ergonómico para trabajos de construcción',
          image: null,
          seller: 'ConstructMax',
          rating: 4.3
        },
        { 
          id: 8, 
          name: 'Sierra Circular', 
          price: 189.99, 
          stock: 12, 
          category: 'Construcción',
          description: 'Sierra circular de 1500W con disco de 7 1/4" para cortes precisos',
          image: null,
          seller: 'ConstructMax',
          rating: 4.7
        },
        { 
          id: 9, 
          name: 'Juego de Destornilladores', 
          price: 49.99, 
          stock: 30, 
          category: 'Construcción',
          description: 'Set de 12 destornilladores de precisión para diversos trabajos',
          image: null,
          seller: 'ToolMaster',
          rating: 4.4
        },
        { 
          id: 10, 
          name: 'Cemento Multiusos', 
          price: 15.99, 
          stock: 200, 
          category: 'Construcción',
          description: 'Saco de cemento de 25kg para trabajos generales de construcción',
          image: null,
          seller: 'MaterialesPro',
          rating: 4.2
        },
        { 
          id: 11, 
          name: 'Escalera Plegable', 
          price: 129.99, 
          stock: 8, 
          category: 'Construcción',
          description: 'Escalera de aluminio plegable de 3 metros con sistema de seguridad',
          image: null,
          seller: 'ConstructMax',
          rating: 4.8
        },
        { 
          id: 12, 
          name: 'Casco de Seguridad', 
          price: 22.99, 
          stock: 75, 
          category: 'Construcción',
          description: 'Casco de protección ajustable para obras y construcción',
          image: null,
          seller: 'SafetyFirst',
          rating: 4.5
        }
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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio en el filtro de categoría
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Abrir modal de detalles del producto
  const handleProductClick = (product, e) => {
    // Evitar abrir modal si se hizo clic en un botón
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
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

  // Generar estrellas para el rating
  const renderRatingStars = (rating) => {
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
    
    return <div className="product-rating">{stars} <span className="rating-number">({rating})</span></div>;
  };

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <div className="header-top">
          <div className="logo">
            <Link to="/">ConstructMarket</Link>
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar productos de construcción..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-button">Buscar</button>
          </div>
          <div className="header-actions">
            <Link to="/login" className="login-btn">Iniciar Sesión</Link>
            <Link to="/register" className="register-btn">Registrarse</Link>
            <button className="cart-btn" onClick={handleGoToCart}>
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>
          </div>
        </div>
        <nav className="catalog-nav">
          <ul>
            <li><Link to="/" className="active">Inicio</Link></li>
            <li><Link to="/catalog">Productos</Link></li>
            <li><Link to="/sellers">Vendedores</Link></li>
            <li><Link to="/offers">Ofertas</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </nav>
      </header>

      <div className="catalog-main">
        <aside className="catalog-sidebar">
          <div className="filter-section">
            <h3>Categorías</h3>
            <div className="category-filter">
              <select 
                value={categoryFilter} 
                onChange={handleCategoryChange}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Filtrar por Precio</h3>
            <div className="price-range">
              <div className="range-input">
                <input type="range" min="0" max="2000" className="range-slider" />
              </div>
              <div className="price-inputs">
                <input type="number" placeholder="Mín" className="min-price" />
                <span>-</span>
                <input type="number" placeholder="Máx" className="max-price" />
              </div>
              <button className="apply-filter">Aplicar</button>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Vendedores</h3>
            <div className="seller-filter">
              <label className="checkbox-label">
                <input type="checkbox" /> ConstructMax
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> MaterialesPro
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> ToolMaster
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> SafetyFirst
              </label>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Valoración</h3>
            <div className="rating-filter">
              <label className="radio-label">
                <input type="radio" name="rating" /> 4★ y más
              </label>
              <label className="radio-label">
                <input type="radio" name="rating" /> 3★ y más
              </label>
              <label className="radio-label">
                <input type="radio" name="rating" /> 2★ y más
              </label>
              <label className="radio-label">
                <input type="radio" name="rating" /> 1★ y más
              </label>
            </div>
          </div>
        </aside>

        <main className="catalog-content">
          <div className="catalog-heading">
            <h1>Productos de Construcción</h1>
            <div className="view-options">
              <button className="view-btn active">
                <span className="grid-icon">□□□</span>
              </button>
              <button className="view-btn">
                <span className="list-icon">≡</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-indicator">Cargando productos...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={(e) => handleProductClick(product, e)}
                >
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="image-placeholder">
                        <span>{product.name.charAt(0)}</span>
                      </div>
                    )}
                    {product.stock < 10 && (
                      <div className="stock-badge">¡Pocas unidades!</div>
                    )}
                    {addedToCartMessage.show && addedToCartMessage.productId === product.id && (
                      <div className="cart-message">¡Añadido al carrito!</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-seller">Vendido por: {product.seller}</p>
                    {renderRatingStars(product.rating)}
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <div className="product-actions">
                      {isInCart(product.id) ? (
                        <div className="in-cart-info">
                          <span className="in-cart-text">En carrito: {getItemQuantity(product.id)}</span>
                          <button 
                            className="view-cart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/cart');
                            }}
                          >
                            Ver Carrito
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="add-to-cart-btn"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          Añadir al Carrito
                        </button>
                      )}
                      <button className="view-details-btn">Ver Detalles</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              No se encontraron productos que coincidan con tu búsqueda.
            </div>
          )}
        </main>
      </div>

      {/* Modal para ver detalles del producto */}
      {showDetailModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button 
                className="close-modal"
                onClick={() => setShowDetailModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="product-detail-grid">
                <div className="product-detail-image">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                  ) : (
                    <div className="image-placeholder large">
                      <span>{selectedProduct.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="product-detail-info">
                  <p className="detail-category">Categoría: {selectedProduct.category}</p>
                  <p className="detail-seller">Vendido por: {selectedProduct.seller}</p>
                  <div className="detail-rating">
                    {renderRatingStars(selectedProduct.rating)}
                  </div>
                  <p className="detail-price">${selectedProduct.price.toFixed(2)}</p>
                  <p className="detail-stock">
                    Stock: {selectedProduct.stock} unidades
                    {selectedProduct.stock < 10 && (
                      <span className="stock-warning"> - ¡Pocas unidades disponibles!</span>
                    )}
                  </p>
                  <p className="detail-description">{selectedProduct.description}</p>
                  
                  <div className="product-quantity">
                    <label htmlFor="quantity">Cantidad:</label>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={productQuantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        id="quantity" 
                        min="1" 
                        max={selectedProduct.stock} 
                        value={productQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1 && value <= selectedProduct.stock) {
                            setProductQuantity(value);
                          }
                        }}
                        readOnly
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange('increase')}
                        disabled={productQuantity >= selectedProduct.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="detail-actions">
                    {isInCart(selectedProduct.id) ? (
                      <button 
                        className="view-cart-btn-lg"
                        onClick={() => {
                          setShowDetailModal(false);
                          navigate('/cart');
                        }}
                      >
                        Ver Carrito ({getItemQuantity(selectedProduct.id)} en carrito)
                      </button>
                    ) : (
                      <>
                        <button 
                          className="add-to-cart-btn-lg"
                          onClick={handleAddToCartFromModal}
                        >
                          Añadir al Carrito
                        </button>
                        <button 
                          className="buy-now-btn"
                          onClick={handleBuyNow}
                        >
                          Comprar Ahora
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="catalog-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>ConstructMarket</h3>
            <p>Tu marketplace especializado en productos de construcción</p>
          </div>
          <div className="footer-column">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalog">Productos</Link></li>
              <li><Link to="/sellers">Vendedores</Link></li>
              <li><Link to="/offers">Ofertas</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Ayuda</h3>
            <ul>
              <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              <li><Link to="/shipping">Envíos</Link></li>
              <li><Link to="/returns">Devoluciones</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Síguenos</h3>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ConstructMarket. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductCatalog;