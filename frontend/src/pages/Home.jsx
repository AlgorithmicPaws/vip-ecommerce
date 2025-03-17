import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import "../styles/Home.css";

// Componentes de layout
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  
  // Estado para productos destacados
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para categorías
  const [categories, setCategories] = useState([
    { id: 1, name: "Herramientas Eléctricas", icon: "🔌", count: 48 },
    { id: 2, name: "Herramientas Manuales", icon: "🔨", count: 36 },
    { id: 3, name: "Material de Construcción", icon: "🧱", count: 52 },
    { id: 4, name: "Electricidad", icon: "💡", count: 29 },
    { id: 5, name: "Fontanería", icon: "🚿", count: 31 },
    { id: 6, name: "Seguridad", icon: "🦺", count: 18 },
  ]);

  // Estado para ofertas especiales
  const [specialOffers, setSpecialOffers] = useState([
    { id: 1, title: "20% DESCUENTO", subtitle: "En todas las herramientas eléctricas", color: "#FF6B6B" },
    { id: 2, title: "ENVÍO GRATIS", subtitle: "En pedidos superiores a 100€", color: "#4ECDC4" },
    { id: 3, title: "DESCUENTOS PARA PROFESIONALES", subtitle: "Regístrate y obtén precios especiales", color: "#1A535C" },
  ]);
  
  // Estado para testimonios
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Carlos Méndez",
      role: "Constructor",
      company: "Construcciones Méndez",
      avatar: null,
      text: "ConstructMarket ha simplificado nuestra cadena de suministro. Precios competitivos y entrega puntual en obra.",
      rating: 5
    },
    {
      id: 2,
      name: "Laura Gómez",
      role: "Arquitecta",
      company: "Estudio LG Arquitectura",
      avatar: null,
      text: "La calidad de los materiales es excepcional. Mis clientes están encantados con los acabados que consigo.",
      rating: 4
    },
    {
      id: 3,
      name: "Alejandro Torres",
      role: "Instalador",
      company: "Instalaciones Torres",
      avatar: null,
      text: "El servicio al cliente es inmejorable. Siempre encuentro lo que necesito y a buen precio.",
      rating: 5
    }
  ]);
  
  // Estado para blogs/artículos
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Cómo elegir la herramienta adecuada para cada trabajo",
      excerpt: "Guía completa para seleccionar herramientas que maximicen tu eficiencia y durabilidad...",
      image: null,
      date: "10 Mar 2025",
      author: "Miguel Sánchez"
    },
    {
      id: 2,
      title: "5 técnicas para optimizar el uso de materiales en construcción",
      excerpt: "Reduce costes y residuos con estas estrategias probadas por profesionales...",
      image: null,
      date: "2 Mar 2025",
      author: "Ana Martínez"
    },
    {
      id: 3,
      title: "Nuevas normativas de seguridad en obras: lo que debes saber",
      excerpt: "Actualización sobre las regulaciones que entrarán en vigor el próximo trimestre...",
      image: null,
      date: "23 Feb 2025",
      author: "Javier López"
    }
  ]);
  
  // Estado para valor añadido/beneficios
  const [benefits, setBenefits] = useState([
    { id: 1, title: "Envío Rápido", description: "Entrega en 24/48h en toda la península", icon: "🚚" },
    { id: 2, title: "Soporte Técnico", description: "Asesoramiento profesional para tus proyectos", icon: "👷‍♂️" },
    { id: 3, title: "Garantía de Calidad", description: "Todos nuestros productos cuentan con garantía", icon: "✅" },
    { id: 4, title: "Devoluciones Fáciles", description: "30 días para devoluciones sin complicaciones", icon: "↩️" }
  ]);
  
  // Estado para marcas colaboradoras
  const [brands, setBrands] = useState([
    "Bosch", "DeWalt", "Makita", "Stanley", "Pladur", "Knauf", "Leroy Merlin", "3M", "Hilti", "Milwaukee"
  ]);
  
  // Estado para herramientas/calculadoras rápidas
  const [quickTools, setQuickTools] = useState([
    { id: 1, name: "Calculadora de Materiales", icon: "🧮", link: "/calculators/materials" },
    { id: 2, name: "Planificador de Proyectos", icon: "📋", link: "/tools/project-planner" },
    { id: 3, name: "Estimador de Presupuesto", icon: "💰", link: "/calculators/budget" },
    { id: 4, name: "Convertidor de Medidas", icon: "📏", link: "/tools/measurements" }
  ]);

  // Efecto para cargar productos destacados
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

  // Renderizar estrellas para rating
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return <div className="product-rating">{stars}</div>;
  };

  // Suscripción al newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción real
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
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
            <div 
              key={offer.id} 
              className="offer-badge"
              style={{ backgroundColor: offer.color }}
            >
              <h3>{offer.title}</h3>
              <p>{offer.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Categorías Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Categorías Principales</h2>
          <Link to="/catalog" className="view-all-link">Ver todas</Link>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => navigate(`/catalog?category=${category.name}`)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.count} productos</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Productos Destacados */}
      <section className="featured-products-section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <Link to="/catalog" className="view-all-link">Ver todos</Link>
        </div>
        
        {loading ? (
          <div className="loading-indicator">Cargando productos destacados...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/catalog/product/${product.id}`)}
              >
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">
                      <span>{product.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-meta">
                    {renderRatingStars(product.rating)}
                    <span className="product-seller">por {product.seller}</span>
                  </div>
                  <div className="product-price">
                    {product.discount > 0 ? (
                      <>
                        <span className="original-price">${product.price.toFixed(2)}</span>
                        <span className="discounted-price">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Beneficios Section */}
      <section className="benefits-section">
        <div className="benefits-grid">
          {benefits.map(benefit => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
      
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
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.avatar ? (
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <span>{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {Array(5).fill(0).map((_, index) => (
                  <span key={index} className={`star ${index < testimonial.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Herramientas Rápidas */}
      <section className="quick-tools-section">
        <div className="section-header">
          <h2>Herramientas para Profesionales</h2>
        </div>
        <div className="tools-grid">
          {quickTools.map(tool => (
            <div key={tool.id} className="tool-card" onClick={() => navigate(tool.link)}>
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <span className="tool-cta">Usar ahora →</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Blog/Artículos */}
      <section className="blog-section">
        <div className="section-header">
          <h2>Consejos y Novedades</h2>
          <Link to="/blog" className="view-all-link">Ver todos</Link>
        </div>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card" onClick={() => navigate(`/blog/${post.id}`)}>
              <div className="blog-image">
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div className="image-placeholder">
                    <span>📰</span>
                  </div>
                )}
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-author">Por {post.author}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="read-more">Leer más →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Marcas */}
      <section className="brands-section">
        <div className="section-header">
          <h2>Nuestras Marcas</h2>
        </div>
        <div className="brands-slider">
          {brands.map((brand, index) => (
            <div key={index} className="brand-item">
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Suscríbete a nuestro boletín</h2>
          <p>Recibe las últimas ofertas, novedades y consejos para tus proyectos</p>
          {isSubscribed ? (
            <div className="subscribe-success">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="subscribe-btn">Suscribirse</button>
            </form>
          )}
        </div>
      </section>
      
      {/* Preguntas Frecuentes */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Preguntas Frecuentes</h2>
        </div>
        <div className="faq-columns">
          <div className="faq-column">
            <div className="faq-item">
              <h3>¿Cuánto tarda el envío?</h3>
              <p>Nuestros envíos tienen un plazo de entrega de 24-48h para península. Para zonas insulares, el plazo es de 3-5 días laborables.</p>
            </div>
            <div className="faq-item">
              <h3>¿Ofrecen factura con IVA desglosado?</h3>
              <p>Sí, emitimos facturas completas con IVA desglosado para todas las compras. Las encontrarás en tu área de cliente.</p>
            </div>
          </div>
          <div className="faq-column">
            <div className="faq-item">
              <h3>¿Tienen descuentos para profesionales?</h3>
              <p>Sí, ofrecemos precios especiales para profesionales registrados según volumen de compra.</p>
            </div>
            <div className="faq-item">
              <h3>¿Cómo puedo devolver un producto?</h3>
              <p>Dispones de 30 días para devoluciones. Puedes gestionar todo el proceso desde tu área de cliente.</p>
            </div>
          </div>
        </div>
        <div className="faq-more">
          <Link to="/faq" className="view-all-link">Ver todas las preguntas</Link>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;