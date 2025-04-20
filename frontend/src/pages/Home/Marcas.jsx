import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Marcas = () => {
  // Estado para marcas colaboradoras con más información
  const [brands, setBrands] = useState([
    { 
      id: 1, 
      name: "Stanley", 
      logo: null, 
      description: "Herramientas de confianza", 
      color: "#ffcc00",
      letter: "S"
    },
    { 
      id: 2, 
      name: "Pladur", 
      logo: null, 
      description: "Especialistas en sistemas de yeso laminado", 
      color: "#004d8e",
      letter: "P"
    },
    { 
      id: 3, 
      name: "Knauf", 
      logo: null, 
      description: "Soluciones de construcción en seco", 
      color: "#0a4a83",
      letter: "K"
    },
    { 
      id: 4, 
      name: "Leroy Merlin", 
      logo: null, 
      description: "Todo para tu hogar y construcción", 
      color: "#78be20",
      letter: "L"
    },
    { 
      id: 5, 
      name: "3M", 
      logo: null, 
      description: "Innovación en productos y materiales", 
      color: "#e51d38",
      letter: "3"
    },
    { 
      id: 6, 
      name: "Bosch", 
      logo: null, 
      description: "Tecnología para la vida", 
      color: "#F2A900",
      letter: "B"
    }
  ]);

  // Estado para controlar la posición actual del carrusel
  const [position, setPosition] = useState(0);
  
  // Estado para controlar si el carrusel debe mostrar animación
  const [animate, setAnimate] = useState(true);
  
  // Referencia para el contenedor del carrusel
  const carouselRef = useRef(null);
  
  // Ancho de los elementos a mostrar
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  // Calcular el ancho de los elementos y cuántos mostrar según el tamaño de la pantalla
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      
      if (width < 576) {
        setVisibleItems(1);
      } else if (width < 768) {
        setVisibleItems(2);
      } else if (width < 992) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
      
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        setItemWidth(containerWidth / visibleItems);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [visibleItems]);
  
  // Animación automática del carrusel
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [position, animate, brands.length]);
  
  // Función para avanzar a la siguiente diapositiva
  const nextSlide = () => {
    setPosition(prev => (prev + 1) % (brands.length - visibleItems + 1));
  };
  
  // Función para retroceder a la diapositiva anterior
  const prevSlide = () => {
    setPosition(prev => (prev - 1 + (brands.length - visibleItems + 1)) % (brands.length - visibleItems + 1));
  };
  
  // Detener la animación cuando el mouse esté sobre el carrusel
  const handleMouseEnter = () => {
    setAnimate(false);
  };
  
  // Reanudar la animación cuando el mouse salga del carrusel
  const handleMouseLeave = () => {
    setAnimate(true);
  };
  
  // Manejar el clic en un punto de navegación
  const handleDotClick = (index) => {
    setPosition(index);
  };

  return (
    <section className="brands-section">
      <div className="section-header">
        <h2>Nuestras Marcas</h2>
        <p className="section-subtitle">Trabajamos con las mejores marcas del sector para ofrecerte productos de calidad</p>
      </div>
      
      <div className="brands-carousel-container">
        <button 
          className="carousel-control prev" 
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        
        <div 
          className="brands-carousel"
          ref={carouselRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="brands-slider" 
            style={{ 
              transform: `translateX(-${position * itemWidth}px)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {brands.map((brand) => (
              <Link 
                to={`/brands/${brand.id}`} 
                key={brand.id} 
                className="brand-card"
                style={{ minWidth: `${itemWidth}px` }}
              >
                <div className="brand-logo" style={{ borderColor: brand.color }}>
                  <span className="brand-letter" style={{ color: brand.color }}>
                    {brand.letter}
                  </span>
                </div>
                <div className="brand-info">
                  <h3 style={{ color: brand.color }}>{brand.name}</h3>
                  <p>{brand.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <button 
          className="carousel-control next" 
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <div className="carousel-dots">
        {Array.from({ length: brands.length - visibleItems + 1 }).map((_, index) => (
          <button 
            key={index} 
            className={`carousel-dot ${position === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Marcas;