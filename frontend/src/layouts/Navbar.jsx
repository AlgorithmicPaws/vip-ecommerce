import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import { useAuth } from '../context/AuthContext';
// Al inicio del archivo Navbar.jsx, junto a las otras importaciones
import * as productService from '../services/productService';
// Asegúrate que la importación del CSS siga siendo la normal
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
    // Dentro del componente Navbar, junto a los otros useState
  const [navCategories, setNavCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(null);


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
    // Dentro del componente Navbar, después de los otros useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryError(null);
        const categoriesData = await productService.getCategories();
        const transformedCategories = productService.transformApiCategories
            ? productService.transformApiCategories(categoriesData || [])
            : (categoriesData || []); // Usa el transformador si existe
        setNavCategories(transformedCategories);
      } catch (error) {
        console.error("Error fetching categories for navbar:", error);
        setCategoryError("No se pudieron cargar las categorías.");
        setNavCategories([]);
      }
    };

    fetchCategories();
  }, []); // El array vacío asegura que se ejecute solo al montar

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

   // Toggle mobile menu
   const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Bloquear scroll cuando el menú está abierto
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Y en el dropdown para móviles
  const toggleDropdown = (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.currentTarget.parentNode.classList.toggle('active');
    }
  };


  return (
    <>
      {/* Mantén las clases originales para el navbar principal y sticky */}
      <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
        <div className="navbar-top">
          <div className="logo-container">
            <Link to="/" className="logo">
              <img src="/logo.svg" className="icon" alt="VIP logo" />
              <span className="market-text">VIP Market</span>
            </Link>
          </div>

          {/* --- Search Form (UPDATED with specific class names) --- */}
          <form className="navbar-search-form" onSubmit={handleSearch}> {/* Nueva clase */}
            <div className="navbar-search-wrapper"> {/* Nueva clase */}
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input" /* Nueva clase */
              />
              <button type="submit" className="navbar-search-button" aria-label="Buscar"> {/* Nueva clase */}
                {/* Icono SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
          {/* --- End Search Form --- */}

          <div className="navbar-actions">
            {isSeller && (
              <Link to="/products" className="sell-btn" style={{
                display: 'flex', alignItems: 'center', padding: '8px 16px',
                borderRadius: '4px', backgroundColor: '#f7b923', color: '#000',
                textDecoration: 'none', fontWeight: '500', gap: '8px', whiteSpace: 'nowrap'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6z"/>
                </svg>
                <span className="sell-text" style={{ fontSize: '14px' }}>Mis Productos</span>
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
              <Link to={isAuthenticated ? "/profile" : "/login"} className="action-link" aria-label="Mi Cuenta">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="action-icon" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                <span className="action-text">{isAuthenticated ? (user?.first_name || 'Mi Cuenta') : 'Mi Cuenta'}</span>
              </Link>

              <Link to="/cart" className="action-link cart-link" aria-label="Carrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="action-icon" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span className="action-text">Carrito</span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </div>
             {/* Botones Auth/Logout (Asegúrate que estén si los necesitas) */}
             <div className="auth-buttons">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="login-btn">Cerrar Sesión</button>
                 ) : (
                     <>
                         <Link to="/login" className="login-btn">Iniciar Sesión</Link>
                         <Link to="/register" className="register-btn">Registrarse</Link>
                     </>
                 )}
              </div>
             {/* Botón menú móvil */}
             <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Abrir menú">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                 </svg>
             </button>
          </div>
        </div>

        {/* Navegación inferior */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
            </li>
            <li className={isActive('/catalog') ? 'active' : ''}>
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Todos los Productos</Link>
            </li>
            <li className={`dropdown ${mobileMenuOpen && window.innerWidth <= 768 ? 'mobile-dropdown' : ''}`}>
              <span className="dropdown-trigger" onClick={toggleDropdown}>Categorías</span>
              <div className="dropdown-menu">
                {/* Map sobre las categorías obtenidas */}
                {navCategories.length > 0 ? (
                  navCategories.map((category) => (
                    <Link
                      key={category.id || category.name} // Usa id si está disponible
                      to={`/catalog?category=${encodeURIComponent(category.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                ) : categoryError ? (
                     // Muestra mensaje de error
                     <span style={{ padding: '10px 15px', display: 'block', color: '#dc3545' }}>{categoryError}</span>
                ) : (
                     // Muestra mensaje de carga
                     <span style={{ padding: '10px 15px', display: 'block', color: '#6c757d' }}>Cargando...</span>
                )}
                {/* Mantén el enlace "Ver todas" */}
                <Link to="/catalog" className="view-all" onClick={() => setMobileMenuOpen(false)}>Ver todas</Link>
              </div>
            </li>
            <li className={isActive('/brands') ? 'active' : ''}>
              <Link to="/brands" onClick={() => setMobileMenuOpen(false)}>Marcas</Link>
            </li>
            {/* <li className={isActive('/offers') ? 'active' : ''}><Link to="/offers">Ofertas</Link></li> */}
          </ul>
        </nav>
      </header>

      {/* Espacio para cuando el navbar es sticky */}
      {isSticky && <div className="navbar-spacer"></div>}

      {/* Overlay para el menú móvil */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;

