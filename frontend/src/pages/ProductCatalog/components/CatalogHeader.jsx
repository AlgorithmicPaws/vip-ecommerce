import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../pages/CartContext';
import SearchBar from '../subcomponents/SearchBar';

const CatalogHeader = ({ onSearch, onGoToCart }) => {
  const { totalItems } = useCart();

  return (
    <header className="catalog-header">
      <div className="header-top">
        <div className="logo">
          <Link to="/">ConstructMarket</Link>
        </div>
        <SearchBar 
          onSearch={onSearch} 
          placeholder="Buscar productos de construcción..."
        />
        <div className="header-actions">
          <Link to="/login" className="login-btn">Iniciar Sesión</Link>
          <Link to="/register" className="register-btn">Registrarse</Link>
          <button className="cart-btn" onClick={onGoToCart}>
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
  );
};

export default CatalogHeader;