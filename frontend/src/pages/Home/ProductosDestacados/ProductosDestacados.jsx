import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingIndicator from "./LoadingIndicator";
import * as productService from "../../../services/productService";

const ProductosDestacados = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Call the service to get featured products (limit to 8)
        const products = await productService.getFeaturedProducts(8);
        setFeaturedProducts(products);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("No se pudieron cargar los productos destacados");
        // Fallback to empty array
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
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
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : featuredProducts.length > 0 ? (
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No hay productos destacados disponibles en este momento.</p>
        </div>
      )}
    </section>
  );
};

export default ProductosDestacados;