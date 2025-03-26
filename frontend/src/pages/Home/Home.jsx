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
import NewsLetter from "./NewsLetter";

const Home = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

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
      <NewsLetter/>
      
      {/* Preguntas Frecuentes */}
      <PreguntasFrecuentes/>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;