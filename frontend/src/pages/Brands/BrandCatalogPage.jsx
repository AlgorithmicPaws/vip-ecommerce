import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCatalog/subcomponents/ProductCard';
import CategoryFilter from '../ProductCatalog/subcomponents/CategoryFilter';
import PriceFilter from '../ProductCatalog/subcomponents/PriceFilter';
import RatingFilter from '../ProductCatalog/subcomponents/RatingFilter';
import '../../styles/BrandCatalogPage.css';

const BrandCatalogPage = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  
  // Estados para la marca y sus productos
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  const [selectedCategoryCount, setSelectedCategoryCount] = useState({});
  
  // Estado para mensaje de añadido al carrito
  const [addedToCartMessage, setAddedToCartMessage] = useState({ show: false, productId: null });

  // Obtener datos de la marca y productos (simulado)
  useEffect(() => {
    setLoading(true);
    
    // Simular llamada a API para obtener datos de la marca
    setTimeout(() => {
      // Datos de marca de ejemplo
      const mockBrands = {
        'dewalt': { 
          id: 'dewalt', 
          name: 'DeWalt', 
          logo: null, 
          description: 'Herramientas profesionales de alta durabilidad. DeWalt es un fabricante estadounidense de herramientas eléctricas para la construcción y la carpintería. La compañía es conocida por sus productos duraderos y su enfoque en la calidad profesional.', 
          bannerImage: null,
          website: 'https://www.dewalt.com',
          yearFounded: 1924,
          headquarters: 'Towson, Maryland, Estados Unidos',
          productCount: 76
        },
        'bosch': { 
          id: 'bosch', 
          name: 'Bosch', 
          logo: null, 
          description: 'Innovación para tu vida. Bosch es una empresa multinacional alemana de ingeniería y electrónica. Produce una amplia gama de productos para la construcción, la industria y el hogar, destacándose por su innovación y calidad.', 
          bannerImage: null,
          website: 'https://www.bosch.com',
          yearFounded: 1886,
          headquarters: 'Gerlingen, Alemania',
          productCount: 124
        },
        'makita': { 
          id: 'makita', 
          name: 'Makita', 
          logo: null, 
          description: 'Herramientas profesionales con batería. Makita es un fabricante japonés de herramientas eléctricas. La empresa es conocida por sus herramientas inalámbricas de alta calidad, especialmente populares entre los profesionales de la construcción.', 
          bannerImage: null,
          website: 'https://www.makita.com',
          yearFounded: 1915,
          headquarters: 'Anjo, Japón',
          productCount: 89
        },
        'stanley': { 
          id: 'stanley', 
          name: 'Stanley', 
          logo: null, 
          description: 'Herramientas confiables para cada trabajo. Stanley es una marca estadounidense de herramientas manuales. Con más de 170 años de historia, la empresa es conocida por sus productos duraderos y funcionales.', 
          bannerImage: null,
          website: 'https://www.stanleytools.com',
          yearFounded: 1843,
          headquarters: 'New Britain, Connecticut, Estados Unidos',
          productCount: 52
        }
      };
      
      // Simulación de productos por marca
      const generateMockProducts = (brandId, count) => {
        const products = [];
        const categories = ['Herramientas Eléctricas', 'Herramientas Manuales', 'Accesorios', 'Almacenamiento', 'Medición'];
        
        for (let i = 1; i <= count; i++) {
          const categoryIndex = Math.floor(Math.random() * categories.length);
          const price = Math.floor(Math.random() * 500) + 50;
          const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0;
          const stock = Math.floor(Math.random() * 50) + 1;
          
          products.push({
            id: `${brandId}-${i}`,
            name: `${mockBrands[brandId].name} ${categories[categoryIndex]} PRO-${i}`,
            price: price,
            originalPrice: discount > 0 ? price + (price * discount / 100) : price,
            discount: discount,
            category: categories[categoryIndex],
            image: null,
            description: `Producto de alta calidad de la marca ${mockBrands[brandId].name}. Ideal para profesionales y aficionados.`,
            stock: stock,
            rating: (Math.random() * 2 + 3).toFixed(1), // Rating entre 3 y 5
            seller: mockBrands[brandId].name,
            brand: mockBrands[brandId].name
          });
        }
        
        return products;
      };
      
      // Verificar si existe la marca
      if (mockBrands[brandId]) {
        const selectedBrand = mockBrands[brandId];
        const brandProducts = generateMockProducts(brandId, selectedBrand.productCount);
        
        // Calcular cantidad de productos por categoría
        const categoryCount = {};
        brandProducts.forEach(product => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        
        setBrand(selectedBrand);
        setProducts(brandProducts);
        setFilteredProducts(brandProducts);
        setSelectedCategoryCount(categoryCount);
        setLoading(false);
      } else {
        // Redireccionar si la marca no existe
        navigate('/brands');
      }
    }, 1000);
  }, [brandId, navigate]);
  
  // Filtrar productos
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Ordenar productos
    switch (sortOption) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'relevance':
      default:
        // No hacer nada, mantener el orden original
        break;
    }
    
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, sortOption, products]);
  
  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Manejar cambio de categoría
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };
  
  // Manejar cambio de orden
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Manejar click en producto
  const handleProductClick = (product) => {
    navigate(`/catalog/product/${product.id}`);
  };
  
  // Manejar añadir al carrito
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    // Aquí iría la lógica real para añadir al carrito
    console.log('Añadido al carrito:', product);
    
    // Mostrar mensaje
    setAddedToCartMessage({ show: true, productId: product.id });
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setAddedToCartMessage({ show: false, productId: null });
    }, 3000);
  };

  return (
    <div className="brand-catalog-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información de la marca...</p>
        </div>
      ) : brand && (
        <div className="brand-catalog-content">
          {/* Banner de la marca */}
          <div className="brand-banner">
            <div className="brand-info">
              <div className="brand-logo">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <div className="brand-logo-placeholder">
                    <span>{brand.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="brand-details">
                <h1>{brand.name}</h1>
                <p className="brand-description">{brand.description}</p>
                <div className="brand-meta">
                  <span className="meta-item">
                    <strong>Fundada:</strong> {brand.yearFounded}
                  </span>
                  <span className="meta-item">
                    <strong>Sede:</strong> {brand.headquarters}
                  </span>
                  <span className="meta-item">
                    <strong>Sitio Web:</strong> <a href={brand.website} target="_blank" rel="noopener noreferrer">{brand.website}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          <div className="brand-breadcrumbs">
            <Link to="/">Inicio</Link> &gt; 
            <Link to="/brands">Marcas</Link> &gt; 
            <span>{brand.name}</span>
          </div>
          
          {/* Navegación y filtros */}
          <div className="catalog-main">
            <aside className="brand-catalog-sidebar">
              <div className="filter-section">
                <h3>Categorías</h3>
                <ul className="category-list">
                  <li className={categoryFilter === '' ? 'active' : ''}>
                    <button onClick={() => handleCategoryChange('')}>
                      Todas las categorías ({products.length})
                    </button>
                  </li>
                  {Object.keys(selectedCategoryCount).map((category) => (
                    <li key={category} className={categoryFilter === category ? 'active' : ''}>
                      <button onClick={() => handleCategoryChange(category)}>
                        {category} ({selectedCategoryCount[category]})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <PriceFilter />
              <RatingFilter />
            </aside>
            
            <main className="brand-catalog-main">
              <div className="catalog-controls">
                <div className="search-bar">
                  <input 
                    type="text" 
                    placeholder={`Buscar en productos ${brand.name}...`} 
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                <div className="sort-options">
                  <label htmlFor="sort-select">Ordenar por:</label>
                  <select 
                    id="sort-select" 
                    value={sortOption} 
                    onChange={handleSortChange}
                  >
                    <option value="relevance">Relevancia</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="discount">Mayor descuento</option>
                  </select>
                </div>
              </div>
              
              {/* Resultados */}
              <div className="results-info">
                <p>{filteredProducts.length} productos encontrados</p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="brand-products-grid">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onProductClick={handleProductClick}
                      onAddToCart={handleAddToCart}
                      showAddedMessage={addedToCartMessage.show && addedToCartMessage.productId === product.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <p>No se encontraron productos para "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')}>Ver todos los productos</button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCatalogPage;