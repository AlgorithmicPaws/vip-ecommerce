"use client"

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Search, ArrowRight } from "lucide-react";

const HeroSection = ({ navigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);

  // Ofertas especiales con iconos personalizados
  const specialOffers = [
    {
      id: 1,
      title: "20% DESCUENTO",
      subtitle: "En todas las herramientas eléctricas",
      color: "#F2A900",
      bgImage: "linear-gradient(135deg, #F2A900 0%, #F8B008 100%)",
      icon: <TruckIcon />,
    },
    {
      id: 2,
      title: "ENVÍO GRATIS",
      subtitle: "En pedidos superiores a 400.000",
      color: "#FFFFFF",
      bgImage: "linear-gradient(135deg, #f16646 0%,rgb(121, 107, 107) 100%)",
      icon: <TruckIcon />,
    },
    {
      id: 3,
      title: "DESCUENTOS IMPERDIBLES",
      subtitle: "Regístrate y obtén precios especiales",
      color: "#FFFFFF",
      bgImage: "linear-gradient(135deg,rgb(43, 144, 226) 0%,rgb(177, 151, 151) 100%)",
      icon: <UserIcon />,
    },
  ];

  // Cambiar automáticamente la tarjeta activa cada 4 segundos
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % specialOffers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, specialOffers.length]);

  // Efecto parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!parallaxRef.current || !heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxRef.current.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Todo lo que necesitas para tu proyecto de construcción</h1>
            <p>Las mejores marcas, precios competitivos y envío rápido para profesionales y particulares</p>

            <div className="hero-buttons">
              <button onClick={() => navigate("/catalog")} className="primary-btn">
                Ver Productos
                <ChevronRight size={18} />
              </button>
              <button onClick={() => navigate("/register")} className="secondary-btn">
                Registro Profesional
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24h</span>
              <span className="stat-label">Entrega</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Valoración</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-container">
            <div className="background-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
              <div ref={parallaxRef} className="shape shape-5"></div>
            </div>

            <div
              className="offers-slider"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="offers-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {specialOffers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className={`offer-card ${index === activeIndex ? "active" : ""}`}
                    style={{
                      background: offer.bgImage,
                    }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="offer-content">
                      <div className="offer-icon-container" style={{ backgroundColor: `${offer.color}20` }}>
                        <div className="offer-icon" style={{ color: offer.color }}>
                          {offer.icon}
                        </div>
                      </div>
                      <h3>{offer.title}</h3>
                      <p>{offer.subtitle}</p>
                    </div>
                    <div className="card-decoration">
                      <div className="decoration-circle"></div>
                      <div className="decoration-line"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="slider-controls">
                {specialOffers.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${index === activeIndex ? "active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componentes de iconos personalizados
const ToolIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const TruckIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 3h15v13H1z"></path>
    <path d="M16 8h4l3 3v5h-7V8z"></path>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const UserIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default HeroSection;