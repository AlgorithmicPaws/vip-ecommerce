import React from "react";

const HeroSection = ({ navigate }) => {
  // Ofertas especiales (No es necesario usar useState)
  const specialOffers = [
    { id: 1, title: "20% DESCUENTO", subtitle: "En todas las herramientas eléctricas", color: "#FF6B6B" },
    { id: 2, title: "ENVÍO GRATIS", subtitle: "En pedidos superiores a 100€", color: "#4ECDC4" },
    { id: 3, title: "DESCUENTOS PARA PROFESIONALES", subtitle: "Regístrate y obtén precios especiales", color: "#1A535C" },
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Todo lo que necesitas para tu proyecto de construcción</h1>
        <p>Las mejores marcas, precios competitivos y envío rápido para profesionales y particulares</p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/catalog")} className="primary-btn">
            Ver Productos
          </button>
          <button onClick={() => navigate("/register")} className="secondary-btn">
            Registro Profesional
          </button>
        </div>
      </div>
      <div className="hero-badges">
        {specialOffers.map(offer => (
          <div key={offer.id} className="offer-badge" style={{ backgroundColor: offer.color }}>
            <h3>{offer.title}</h3>
            <p>{offer.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
