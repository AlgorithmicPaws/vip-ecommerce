import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingIndicator from "./LoadingIndicator";
import * as productService from "../../../services/productService";

const ProductosDestacados = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch featured products from API (limited to 8)
        const products = await productService.getFeaturedProducts(8);
        setFeaturedProducts(products);
      } catch (err) {
        console.error("Error loading featured products:", err);
        setError("No se pudieron cargar los productos destacados");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="featured-products-section">
      <div className="section-header">
        <h2>Productos Destacados</h2>
        <Link to="/catalog" className="view-all-link">Ver todos</Link>
      </div>

      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : featuredProducts.length > 0 ? (
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          No hay productos destacados disponibles en este momento.
        </div>
      )}
    </section>
  );
};

export default ProductosDestacados;