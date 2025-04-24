import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout, isSeller } = useAuth();
  
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

  // Handle logout
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="navbar-top">
          <div className="logo-container">
            <Link to="/" className="logo">
              <img src="/logo.svg" className="icon" alt="VIP logo" />
              <span className="market-text">VIP Market</span>
            </Link>
          </div>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </button>
          </form>
          
          <div className="navbar-actions">
            {isSeller && (
              <Link to="/products" className="sell-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045z"/>
                </svg>
                <span className="sell-text">Mis Productos</span>
              </Link>
            )}
            
            {!isSeller && (
              <Link to="/sell" className="sell-btn">
                <div className="sell-btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                  </svg>
                </div>
                <span className="sell-text">Vende con nosotros</span>
              </Link>
            )}
            
            <div className="action-links">
              <Link to={isAuthenticated ? "/profile" : "/login"} className="action-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                <span className="action-text">{isAuthenticated ? (user?.first_name || 'Mi Cuenta') : 'Mi Cuenta'}</span>
              </Link>
              
              <Link to="/cart" className="action-link cart-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span className="action-text">Carrito</span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </div>
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
            <li className={isActive('/brands') ? 'active' : ''}>
              <Link to="/brands">Marcas</Link>
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