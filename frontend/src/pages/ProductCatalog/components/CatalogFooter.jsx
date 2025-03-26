import React from 'react';
import { Link } from 'react-router-dom';

const CatalogFooter = () => {
  return (
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
        <p>&copy; {new Date().getFullYear()} ConstructMarket. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default CatalogFooter;