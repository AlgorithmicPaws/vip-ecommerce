import { useState, useEffect } from "react";

const Marcas = () => {
  // Estado para marcas colaboradoras con más información
  const [brands, setBrands] = useState([
    { 
      id: 1, 
      name: "Bosch", 
      logo: null, 
      description: "Herramientas profesionales de alta calidad", 
      color: "#0066b2" 
    },
    { 
      id: 2, 
      name: "DeWalt", 
      logo: null, 
      description: "Soluciones resistentes para profesionales", 
      color: "#febd17" 
    },
    { 
      id: 3, 
      name: "Makita", 
      logo: null, 
      description: "Innovación en herramientas eléctricas", 
      color: "#0058a1" 
    },
    { 
      id: 4, 
      name: "Stanley", 
      logo: null, 
      description: "Herramientas manuales de confianza", 
      color: "#ffcc00" 
    },
    { 
      id: 5, 
      name: "Pladur", 
      logo: null, 
      description: "Especialistas en sistemas de yeso laminado", 
      color: "#004d8e" 
    },
    { 
      id: 6, 
      name: "Knauf", 
      logo: null, 
      description: "Soluciones de construcción en seco", 
      color: "#0a4a83" 
    },
    { 
      id: 7, 
      name: "Leroy Merlin", 
      logo: null, 
      description: "Todo para tu hogar y construcción", 
      color: "#78be20" 
    },
    { 
      id: 8, 
      name: "3M", 
      logo: null, 
      description: "Innovación en productos y materiales", 
      color: "#e51d38" 
    },
    { 
      id: 9, 
      name: "Hilti", 
      logo: null, 
      description: "Herramientas de alto rendimiento", 
      color: "#ee2d24" 
    },
    { 
      id: 10, 
      name: "Milwaukee", 
      logo: null, 
      description: "Herramientas para profesionales exigentes", 
      color: "#e31837" 
    }
  ]);

  // Estado para controlar la animación del carrusel
  const [position, setPosition] = useState(0);
  
  // Animación automática del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev + 1) % brands.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [brands.length]);

  return (
    <section className="brands-section">
      <div className="section-header">
        <h2>Nuestras Marcas</h2>
        <p className="brands-subtitle">Trabajamos con las mejores marcas del sector para ofrecerte productos de calidad</p>
      </div>
      
      <div className="brands-container">
        <div className="brands-slider" style={{ transform: `translateX(-${position * 10}%)` }}>
          {brands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div 
                className="brand-logo" 
                style={{ backgroundColor: `${brand.color}20`, borderColor: brand.color }}
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <div className="brand-letter" style={{ color: brand.color }}>
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="brand-info">
                <h3 style={{ color: brand.color }}>{brand.name}</h3>
                <p>{brand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="brands-navigation">
        {brands.map((_, index) => (
          <button 
            key={index} 
            className={`nav-dot ${index === position ? 'active' : ''}`}
            onClick={() => setPosition(index)}
          />
        ))}
      </div>
      
      <div className="brands-footer">
        <p>¿Quieres distribuir tus productos en nuestra plataforma? <a href="/contact">Contáctanos</a></p>
      </div>
    </section>
  );
};

export default Marcas;