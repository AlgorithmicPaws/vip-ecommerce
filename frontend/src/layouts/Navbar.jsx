import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  
  // Estado para control de menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Estado para control de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para control de menú fijo al hacer scroll
  const [isSticky, setIsSticky] = useState(false);
  
  // Categorías principales
  const mainCategories = [
    { name: "Herramientas Eléctricas", path: "/catalog?category=Herramientas%20Eléctricas" },
    { name: "Herramientas Manuales", path: "/catalog?category=Herramientas%20Manuales" },
    { name: "Material de Construcción", path: "/catalog?category=Material%20de%20Construcción" },
    { name: "Electricidad", path: "/catalog?category=Electricidad" },
    { name: "Fontanería", path: "/catalog?category=Fontanería" },
    { name: "Seguridad", path: "/catalog?category=Seguridad" },
  ];
  
  // Efecto para hacer el navbar fijo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };
  
  // Verificar si está en la página actual
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="navbar-top">
          <div className="logo-container">
            <Link to="/" className="logo">
              ConstructMarket
            </Link>
          </div>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <span className="search-icon">🔍</span>
            </button>
          </form>
          
          <div className="navbar-actions">
            <Link to="/sell" className="sell-btn">
              <span className="sell-icon">🏪</span>
              <span className="sell-text">Vende con nosotros</span>
            </Link>
            
            <div className="action-links">
              <Link to="/profile" className="action-link">
                <span className="action-icon">👤</span>
                <span className="action-text">Mi Cuenta</span>
              </Link>
              
              <Link to="/cart" className="action-link cart-link">
                <span className="action-icon">🛒</span>
                <span className="action-text">Carrito</span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </div>
            
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Iniciar Sesión</Link>
              <Link to="/register" className="register-btn">Registro</Link>
            </div>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú móvil"
            >
              <span className="menu-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/">Inicio</Link>
            </li>
            <li className={isActive('/catalog') ? 'active' : ''}>
              <Link to="/catalog">Todos los Productos</Link>
            </li>
            <li className={isActive('/brands') ? 'active' : ''}>
              <Link to="/brands">Marcas</Link>
            </li>
            <li className="dropdown">
              <span className="dropdown-trigger">Categorías</span>
              <div className="dropdown-menu">
                {mainCategories.map((category, index) => (
                  <Link key={index} to={category.path}>
                    {category.name}
                  </Link>
                ))}
                <Link to="/catalog" className="view-all">Ver todas</Link>
              </div>
            </li>
            <li className={isActive('/offers') ? 'active' : ''}>
              <Link to="/offers">Ofertas</Link>
            </li>
            <li className={isActive('/professionals') ? 'active' : ''}>
              <Link to="/professionals">Área Profesional</Link>
            </li>
            <li className={isActive('/sell') ? 'active' : ''}>
              <Link to="/sell" className="sell-with-us-nav">Vende con Nosotros</Link>
            </li>
            <li className={isActive('/blog') ? 'active' : ''}>
              <Link to="/blog">Blog</Link>
            </li>
            <li className={isActive('/contact') ? 'active' : ''}>
              <Link to="/contact">Contacto</Link>
            </li>
            <li className={isActive('/products') ? 'active' : ''}>
              <Link to="/products">Gestión de Productos</Link>
            </li>
            <li className={isActive('/admin') ? 'active' : ''}>
              <Link to="/admin">Administrador</Link>
            </li>
            
            
          </ul>
        </nav>
      </header>
      
      {/* Espacio para cuando el navbar es sticky */}
      {isSticky && <div className="navbar-spacer"></div>}
      
      {/* Overlay para el menú móvil */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;