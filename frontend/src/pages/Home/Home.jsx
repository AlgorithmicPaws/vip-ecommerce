import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import "../../styles/Home.css";
import "../../styles/HeroSection.css"; // Importamos los nuevos estilos

// Componentes
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import HeroSection from "./HeroSection";
import CategoriasSection from "./CategoriasSection";
import ProductosDestacados from "./ProductosDestacados/ProductosDestacados";
import Testimonios from "./Testimonios";
import Marcas from "./Marcas";
import PreguntasFrecuentes from "./PreguntasFrecuentes";
import SellWithUs from "./SellWithUs";

const Home = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection navigate={navigate} />
      
      {/* Categorías Section */}
      <CategoriasSection navigate={navigate} />
      
      {/* Productos Destacados */}
      <section className="featured-products-section">
        <div className="section-container">
          <ProductosDestacados navigate={navigate} />
        </div>
      </section>
      
      {/* Marcas */}
      <section className="brands-section">
        <div className="section-container">
          <Marcas />
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="testimonials-section">
        <div className="section-container">
          <Testimonios />
        </div>
      </section>
      
      {/* Sección Vende con Nosotros */}
      <SellWithUs navigate={navigate} />
      
      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="section-container">
          <PreguntasFrecuentes />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;