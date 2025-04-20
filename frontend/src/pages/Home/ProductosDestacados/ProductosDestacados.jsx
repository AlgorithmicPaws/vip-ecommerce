import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingIndicator from "./LoadingIndicator";

const ProductosDestacados = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de productos desde API
    setTimeout(() => {
      const mockFeaturedProducts = [
        { 
          id: 8, 
          name: 'Sierra Circular Profesional', 
          price: 189.99, 
          rating: 4.7,
          image: null,
          discount: 15,
          seller: 'ConstructMax',
          category: 'Herramientas Eléctricas'
        },
        { 
          id: 11, 
          name: 'Escalera Telescópica Aluminio', 
          price: 129.99, 
          rating: 4.8,
          image: null,
          discount: 0,
          seller: 'ConstructMax',
          category: 'Seguridad'
        },
        { 
          id: 13, 
          name: 'Taladro Percutor 18V', 
          price: 149.99, 
          rating: 4.9,
          image: null,
          discount: 10,
          seller: 'ToolMaster',
          category: 'Herramientas Eléctricas'
        },
        { 
          id: 14, 
          name: 'Set Destornilladores Precisión', 
          price: 49.99, 
          rating: 4.5,
          image: null,
          discount: 0,
          seller: 'ToolMaster',
          category: 'Herramientas Manuales'
        },
        { 
          id: 15, 
          name: 'Hormigonera 160L con Motor', 
          price: 299.99, 
          rating: 4.6,
          image: null,
          discount: 8,
          seller: 'ConstructMax',
          category: 'Material de Construcción'
        },
        { 
          id: 16, 
          name: 'Lijadora Orbital Profesional', 
          price: 79.99, 
          rating: 4.3,
          image: null,
          discount: 0,
          seller: 'ToolMaster',
          category: 'Herramientas Eléctricas'
        },
        { 
          id: 17, 
          name: 'Kit de Seguridad Completo', 
          price: 89.99, 
          rating: 4.7,
          image: null,
          discount: 20,
          seller: 'SafetyFirst',
          category: 'Seguridad'
        },
        { 
          id: 18, 
          name: 'Nivel Láser Autonivelante', 
          price: 159.99, 
          rating: 4.8,
          image: null,
          discount: 5,
          seller: 'ToolMaster',
          category: 'Herramientas Eléctricas'
        }
      ];
      
      setFeaturedProducts(mockFeaturedProducts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="featured-products-section">
      <div className="section-header">
        <div>
          <h2>Productos Destacados</h2>
          <p className="section-subtitle">Descubre nuestras mejores ofertas y productos más vendidos</p>
        </div>
        <Link to="/catalog" className="view-all-link">Ver todos →</Link>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductosDestacados;