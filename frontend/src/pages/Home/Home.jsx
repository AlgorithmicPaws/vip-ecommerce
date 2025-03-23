import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../CartContext";
import "../../styles/Home.css";

// Componentes de layout
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import HeroSection from "./HeroSection";
import CategoriasSection from "./CategoriasSection";
import ProductosDestacados from "./ProductosDestacados/ProductosDestacados";
import Testimonios from "./Testimonios";
import HerramientasRapidas from "./HerramientasRapidas";
import Blog from "./Blog";
import Marcas from "./Marcas";
import Beneficios from "./Beneficios";
import PreguntasFrecuentes from "./PreguntasFrecuentes";

const Home = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  
  // Suscripción al newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción real
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section, Sección de promociones */}
      <HeroSection navigate={navigate}/>
      
      {/* Categorías Section */}
      <CategoriasSection navigate={navigate}/>
      
      {/* Productos Destacados */}
      <ProductosDestacados navigate={navigate}/>
      
      {/* Beneficios Section */}
      <Beneficios/>
      
      {/* Banner Promocional */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>¿Eres un profesional de la construcción?</h2>
          <p>Regístrate como profesional y obtén descuentos exclusivos, facturación simplificada y entrega prioritaria</p>
          <button onClick={() => navigate("/register")} className="primary-btn">
            Crear Cuenta Profesional
          </button>
        </div>
      </section>
      
      {/* Testimonios */}
      <Testimonios/>
      
      {/* Herramientas Rápidas */}
      <HerramientasRapidas navigate={navigate}/>
      
      {/* Blog/Artículos */}
      <Blog navigate={navigate}/>
      
      {/* Marcas */}
      <Marcas/>
      
      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Suscríbete a nuestro boletín</h2>
          <p>Recibe las últimas ofertas, novedades y consejos para tus proyectos</p>
          {isSubscribed ? (
            <div className="subscribe-success">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="subscribe-btn">Suscribirse</button>
            </form>
          )}
        </div>
      </section>
      
      {/* Preguntas Frecuentes */}
      <PreguntasFrecuentes/>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;