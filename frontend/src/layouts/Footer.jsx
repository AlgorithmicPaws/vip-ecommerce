import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Enlaces para el footer
  const categories = [
    { name: "Herramientas Eléctricas", path: "/catalog?category=Herramientas%20Eléctricas" },
    { name: "Herramientas Manuales", path: "/catalog?category=Herramientas%20Manuales" },
    { name: "Material de Construcción", path: "/catalog?category=Material%20de%20Construcción" },
    { name: "Electricidad", path: "/catalog?category=Electricidad" },
    { name: "Fontanería", path: "/catalog?category=Fontanería" },
    { name: "Seguridad", path: "/catalog?category=Seguridad" },
  ];
  
  const customerService = [
    { name: "Envíos y Entregas", path: "/shipping" },
    { name: "Devoluciones", path: "/returns" },
    { name: "Garantías", path: "/warranty" },
    { name: "Servicio Técnico", path: "/support" },
    { name: "Preguntas Frecuentes", path: "/faq" },
    { name: "Contacto", path: "/contact" },
  ];
  
  const company = [
    { name: "Sobre Nosotros", path: "/about" },
    { name: "Trabaja con Nosotros", path: "/jobs" },
    { name: "Blog", path: "/blog" },
    { name: "Prensa", path: "/press" },
    { name: "Responsabilidad Social", path: "/csr" },
    { name: "Afiliados", path: "/affiliates" },
  ];
  
  const myAccount = [
    { name: "Mi Perfil", path: "/profile" },
    { name: "Mis Pedidos", path: "/profile?tab=orders" },
    { name: "Mis Direcciones", path: "/profile?tab=addresses" },
    { name: "Mi Carrito", path: "/cart" },
    { name: "Lista de Deseos", path: "/wishlist" },
  ];
  
  // Métodos de pago
  const paymentMethods = [
    "Visa", "Mastercard", "American Express", "PayPal", "Transferencia", "Contrareembolso"
  ];
  
  // Redes sociales
  const socialMedia = [
    { name: "Facebook", icon: "📘", url: "https://facebook.com/" },
    { name: "Twitter", icon: "📗", url: "https://twitter.com/" },
    { name: "Instagram", icon: "📸", url: "https://instagram.com/" },
    { name: "YouTube", icon: "📹", url: "https://youtube.com/" },
    { name: "LinkedIn", icon: "📘", url: "https://linkedin.com/" },
  ];
  
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <Link to="/" className="footer-logo">
            ConstructMarket
          </Link>
          <p className="footer-slogan">
            Todo lo que necesitas para tus proyectos de construcción
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>900 123 456</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span>info@constructmarket.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🏢</span>
              <span>Calle Construcción 123, 28001 Madrid</span>
            </div>
          </div>
          <div className="social-links">
            {socialMedia.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.name}
              >
                <span>{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-column">
            <h3>Categorías</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={category.path}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>Atención al cliente</h3>
            <ul>
              {customerService.map((service, index) => (
                <li key={index}>
                  <Link to={service.path}>{service.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>Empresa</h3>
            <ul>
              {company.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>Mi cuenta</h3>
            <ul>
              {myAccount.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-middle">
        <div className="payment-methods">
          <h3>Formas de pago</h3>
          <div className="payment-icons">
            {paymentMethods.map((method, index) => (
              <span key={index} className="payment-icon">{method}</span>
            ))}
          </div>
        </div>
        
        <div className="footer-app">
          <h3>Descarga nuestra app</h3>
          <div className="app-buttons">
            <button className="app-btn">
              <span className="app-icon">📱</span>
              <span className="app-text">
                <small>Descargar en</small>
                <strong>App Store</strong>
              </span>
            </button>
            <button className="app-btn">
              <span className="app-icon">🤖</span>
              <span className="app-text">
                <small>Disponible en</small>
                <strong>Google Play</strong>
              </span>
            </button>
          </div>
        </div>
        
        <div className="footer-newsletter">
          <h3>Suscríbete al boletín</h3>
          <p>Recibe ofertas exclusivas y noticias del sector</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" required />
            <button type="submit">Suscribirse</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <Link to="/terms">Términos y Condiciones</Link>
          <Link to="/privacy">Política de Privacidad</Link>
          <Link to="/cookies">Política de Cookies</Link>
          <Link to="/legal">Aviso Legal</Link>
        </div>
        
        <div className="copyright">
          © {currentYear} ConstructMarket. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;