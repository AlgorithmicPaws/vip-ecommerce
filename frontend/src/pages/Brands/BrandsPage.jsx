import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/BrandsPage.css';

// Componente para la tarjeta de marca
const BrandCard = ({ brand }) => {
  return (
    <Link to={`/brands/${brand.id}`} className="brand-card">
      <div className="brand-image">
        {brand.logo ? (
          <img src={brand.logo} alt={brand.name} />
        ) : (
          <div className="logo-placeholder">
            <span>{brand.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="brand-info">
        <h3 className="brand-name">{brand.name}</h3>
        <p className="brand-products">{brand.productCount} productos</p>
      </div>
    </Link>
  );
};

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);
  
  // Obtener marcas (simulado)
  useEffect(() => {
    // Simular carga de marcas desde una API
    setTimeout(() => {
      const mockBrands = [
        { 
          id: 'dewalt', 
          name: 'DeWalt', 
          logo: null, 
          description: 'Herramientas profesionales de alta durabilidad',
          productCount: 76,
          featured: true
        },
        { 
          id: 'bosch', 
          name: 'Bosch', 
          logo: null, 
          description: 'Innovación para tu vida',
          productCount: 124,
          featured: true
        },
        { 
          id: 'makita', 
          name: 'Makita', 
          logo: null, 
          description: 'Herramientas profesionales con batería',
          productCount: 89,
          featured: true
        },
        { 
          id: 'stanley', 
          name: 'Stanley', 
          logo: null, 
          description: 'Herramientas confiables para cada trabajo',
          productCount: 52,
          featured: true
        },
        { 
          id: 'hilti', 
          name: 'Hilti', 
          logo: null, 
          description: 'Soluciones de construcción profesionales',
          productCount: 43,
          featured: false
        },
        { 
          id: 'milwaukee', 
          name: 'Milwaukee', 
          logo: null, 
          description: 'Herramientas para profesionales',
          productCount: 67,
          featured: false
        },
        { 
          id: 'knauf', 
          name: 'Knauf', 
          logo: null, 
          description: 'Sistemas de construcción en seco',
          productCount: 28,
          featured: false
        },
        { 
          id: '3m', 
          name: '3M', 
          logo: null, 
          description: 'Innovación en cada producto',
          productCount: 34,
          featured: false
        },
        { 
          id: 'sika', 
          name: 'Sika', 
          logo: null, 
          description: 'Productos químicos para la construcción',
          productCount: 45,
          featured: false
        },
        { 
          id: 'leroy-merlin', 
          name: 'Leroy Merlin', 
          logo: null, 
          description: 'Todo para el hogar y la construcción',
          productCount: 120,
          featured: false
        },
        { 
          id: 'fischer', 
          name: 'Fischer', 
          logo: null, 
          description: 'Sistemas de fijación profesionales',
          productCount: 38,
          featured: false
        },
        { 
          id: 'pladur', 
          name: 'Pladur', 
          logo: null, 
          description: 'Soluciones en yeso laminado',
          productCount: 22,
          featured: false
        },
      ];
      
      setBrands(mockBrands);
      setFilteredBrands(mockBrands);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filtrar marcas por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
  }, [searchTerm, brands]);
  
  // Manejar cambio en el input de búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Obtener marcas destacadas
  const featuredBrands = brands.filter(brand => brand.featured);
  
  return (
    <div className="brands-page-container">
      <div className="brands-page-content">
        <div className="brands-header">
          <h1>Marcas Disponibles</h1>
          <p>Explora todas las marcas de construcción en nuestro marketplace</p>
          
          <div className="brands-search">
            <input 
              type="text" 
              placeholder="Buscar marcas..." 
              value={searchTerm} 
              onChange={handleSearch}
              aria-label="Buscar marcas"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando marcas...</p>
          </div>
        ) : (
          <>
            {/* Sección de marcas destacadas - solo se muestra cuando no hay búsqueda activa */}
            {featuredBrands.length > 0 && !searchTerm && (
              <div className="featured-brands-section">
                <h2>Marcas Destacadas</h2>
                <div className="brands-grid">
                  {featuredBrands.map(brand => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Todas las marcas */}
            <div className="all-brands-section">
              <h2>{searchTerm ? 'Resultados de búsqueda' : 'Todas las Marcas'}</h2>
              {filteredBrands.length > 0 ? (
                <div className="brands-grid">
                  {filteredBrands.map(brand => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No se encontraron marcas con "{searchTerm}"</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;