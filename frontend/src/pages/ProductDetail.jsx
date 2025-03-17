import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  // Estado del producto
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para visualización
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  
  // Estado para reseñas
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    name: '',
    email: '',
    comment: ''
  });
  
  // Estado para preguntas
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    name: '',
    email: '',
    question: ''
  });
  
  // Estado para productos relacionados
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Cargar datos del producto
  useEffect(() => {
    // Simulación de carga de datos de API
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Producto simulado
        const mockProduct = {
          id: parseInt(productId),
          name: 'Sierra Circular Profesional',
          brand: 'DeWalt',
          model: 'DCS575T2',
          sku: 'DW-123456',
          category: 'Herramientas Eléctricas',
          subcategory: 'Sierras',
          price: 189.99,
          originalPrice: 219.99,
          discount: 14,
          rating: 4.7,
          reviewCount: 128,
          stock: 15,
          description: `La sierra circular DeWalt DCS575T2 es una herramienta potente y versátil diseñada para profesionales de la construcción. Con su motor sin escobillas FLEXVOLT® de 60V MAX*, ofrece la potencia y el rendimiento de una herramienta con cable en un diseño inalámbrico.

          Características:
          • Motor sin escobillas que proporciona 5800 RPM
          • Capacidad de corte de bisel de 57 grados
          • Profundidad de corte de 61 mm a 90 grados
          • Freno eléctrico para mayor seguridad
          • Diseño ergonómico con empuñadura optimizada
          • Compatible con sistema de extracción de polvo
          • Sistema de iluminación LED para mayor visibilidad
          
          El diseño robusto y ergonómico garantiza comodidad durante uso prolongado, mientras que su sistema de extracción de polvo integrado mantiene limpia el área de trabajo. La precisión de corte es excepcional gracias a su guía láser y su base de aluminio de alta resistencia.
          
          Esta sierra es ideal para carpinteros, contratistas y profesionales que requieren una herramienta fiable para trabajos de construcción exigentes.`,
          
          specifications: [
            { name: "Potencia", value: "1600W" },
            { name: "Velocidad", value: "5800 RPM" },
            { name: "Diámetro del disco", value: "184 mm" },
            { name: "Profundidad máxima de corte", value: "61 mm a 90°" },
            { name: "Capacidad de bisel", value: "57 grados" },
            { name: "Peso", value: "3.6 kg" },
            { name: "Voltaje", value: "60V" },
            { name: "Material de la base", value: "Aluminio de alta resistencia" },
            { name: "Incluye", value: "2 baterías, cargador, maletín, disco de 24 dientes, llave, guía paralela" },
            { name: "Garantía", value: "3 años limitada del fabricante" },
            { name: "Dimensiones", value: "38 x 22 x 28 cm" },
            { name: "País de origen", value: "Estados Unidos" }
          ],
          
          features: [
            "Motor sin escobillas de alto rendimiento",
            "Sistema FLEXVOLT® para máxima potencia",
            "Freno eléctrico de seguridad",
            "Base de aluminio de alta resistencia",
            "Guía láser para cortes precisos",
            "Sistema de extracción de polvo integrado",
            "Iluminación LED para mejor visibilidad",
            "Empuñadura ergonómica antideslizante"
          ],
          
          images: [
            null, // Imagen principal (null para usar placeholder)
            null, // Imágenes adicionales
            null,
            null
          ],
          
          seller: 'ConstructMax',
          sellerRating: 4.8,
          sellerSince: '2019',
          shippingInfo: {
            free: true,
            estimatedDelivery: '2-3 días laborables',
            returns: '30 días, devolución gratuita'
          },
          warranty: '3 años de garantía oficial DeWalt',
          paymentOptions: ['Tarjeta de crédito', 'PayPal', 'Transferencia', 'Contrareembolso'],
          certification: ['CE', 'RoHS']
        };
        
        setProduct(mockProduct);
        
        // Reseñas simuladas
        const mockReviews = [
          {
            id: 1,
            author: 'Carlos Martínez',
            rating: 5,
            date: '12/02/2025',
            comment: 'Excelente herramienta. Potente, precisa y la batería dura bastante. Perfecta para trabajos de carpintería profesional.',
            helpful: 8,
            verified: true
          },
          {
            id: 2,
            author: 'Laura Sánchez',
            rating: 4,
            date: '05/02/2025',
            comment: 'Muy buena sierra, aunque un poco pesada para mi gusto. La potencia es impresionante y los cortes son muy limpios.',
            helpful: 3,
            verified: true
          },
          {
            id: 3,
            author: 'Miguel Fernández',
            rating: 5,
            date: '28/01/2025',
            comment: 'Vale cada céntimo. La uso a diario en mi trabajo y no me ha dado ningún problema. El sistema de extracción de polvo funciona realmente bien.',
            helpful: 5,
            verified: true
          }
        ];
        setReviews(mockReviews);
        
        // Preguntas simuladas
        const mockQuestions = [
          {
            id: 1,
            author: 'Pedro López',
            date: '15/02/2025',
            question: '¿Es compatible con discos de otras marcas?',
            answer: 'Sí, es compatible con cualquier disco estándar de 184mm, siempre que cumpla con las especificaciones de seguridad.',
            answeredBy: 'ConstructMax (Vendedor)',
            answerDate: '16/02/2025'
          },
          {
            id: 2,
            author: 'Ana Gómez',
            date: '10/02/2025',
            question: '¿Viene con maletín de transporte?',
            answer: 'Sí, incluye un maletín resistente DeWalt con espacio para la herramienta, baterías y accesorios.',
            answeredBy: 'ConstructMax (Vendedor)',
            answerDate: '11/02/2025'
          }
        ];
        setQuestions(mockQuestions);
        
        // Productos relacionados simulados
        const mockRelatedProducts = [
          {
            id: 101,
            name: 'Disco de Sierra 184mm 40D',
            price: 24.99,
            rating: 4.5,
            image: null,
            category: 'Accesorios'
          },
          {
            id: 102,
            name: 'Batería DeWalt FLEXVOLT 60V',
            price: 89.99,
            rating: 4.8,
            image: null,
            category: 'Baterías y Cargadores'
          },
          {
            id: 103,
            name: 'Guía para Sierra Circular',
            price: 34.99,
            rating: 4.6,
            image: null,
            category: 'Accesorios'
          },
          {
            id: 104,
            name: 'Sierra de Calar DeWalt',
            price: 159.99,
            rating: 4.7,
            image: null,
            category: 'Herramientas Eléctricas'
          }
        ];
        setRelatedProducts(mockRelatedProducts);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del producto');
        setLoading(false);
        console.error('Error al cargar el producto:', err);
      }
    }, 1000);
  }, [productId]);

  // Manejar cambio de cantidad
  const handleQuantityChange = (value) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  // Añadir al carrito
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        seller: product.seller,
        category: product.category
      }, quantity);
    }
  };

  // Comprar ahora
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  // Enviar reseña
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar la reseña a la API
    const newReview = {
      id: reviews.length + 1,
      author: reviewForm.name,
      rating: reviewForm.rating,
      date: new Date().toLocaleDateString(),
      comment: reviewForm.comment,
      helpful: 0,
      verified: false
    };
    
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setReviewForm({
      rating: 5,
      name: '',
      email: '',
      comment: ''
    });
    
    alert('¡Gracias por tu reseña! Será publicada tras ser revisada por nuestro equipo.');
  };

  // Enviar pregunta
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar la pregunta a la API
    const newQuestion = {
      id: questions.length + 1,
      author: questionForm.name,
      date: new Date().toLocaleDateString(),
      question: questionForm.question,
      answer: null,
      answeredBy: null,
      answerDate: null
    };
    
    setQuestions([newQuestion, ...questions]);
    setShowQuestionForm(false);
    setQuestionForm({
      name: '',
      email: '',
      question: ''
    });
    
    alert('¡Gracias por tu pregunta! La responderemos lo antes posible.');
  };

  // Render estrellas para rating
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
    
    return <div className="rating-stars">{stars}</div>;
  };

  // Renderizar producto
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="product-detail-container">
          <div className="error-container">
            <h2>Ha ocurrido un error</h2>
            <p>{error || 'No se pudo cargar el producto'}</p>
            <button onClick={() => navigate('/catalog')} className="primary-btn">
              Volver al catálogo
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Inicio</Link> &gt; 
          <Link to="/catalog">Productos</Link> &gt; 
          <Link to={`/catalog?category=${encodeURIComponent(product.category)}`}>
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              &gt; 
              <Link to={`/catalog?subcategory=${encodeURIComponent(product.subcategory)}`}>
                {product.subcategory}
              </Link>
            </>
          )}
          &gt; <span>{product.name}</span>
        </div>
        
        {/* Contenido principal */}
        <div className="product-main">
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="main-image">
              {product.images[selectedImage] ? (
                <img 
                  src={product.images[selectedImage]} 
                  alt={`${product.name} - Imagen ${selectedImage + 1}`} 
                  className="product-img"
                />
              ) : (
                <div className="image-placeholder">
                  <span>{product.name.charAt(0)}</span>
                </div>
              )}
              {product.discount > 0 && (
                <div className="discount-badge">-{product.discount}%</div>
              )}
            </div>
            
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  {image ? (
                    <img src={image} alt={`Miniatura ${index + 1}`} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <span>{index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Información del producto */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating">
                {renderRatingStars(product.rating)}
                <span className="rating-count">
                  {product.rating} ({product.reviewCount} reseñas)
                </span>
              </div>
              
              <div className="product-brand">
                <span className="meta-label">Marca:</span>
                <Link to={`/catalog?brand=${encodeURIComponent(product.brand)}`} className="meta-value brand-link">
                  {product.brand}
                </Link>
              </div>
              
              <div className="product-model">
                <span className="meta-label">Modelo:</span>
                <span className="meta-value">{product.model}</span>
              </div>
              
              <div className="product-sku">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{product.sku}</span>
              </div>
            </div>
            
            <div className="product-price-container">
              {product.discount > 0 ? (
                <>
                  <div className="price-original">${product.originalPrice.toFixed(2)}</div>
                  <div className="price-current">${product.price.toFixed(2)}</div>
                  <div className="price-saving">
                    Ahorras: ${(product.originalPrice - product.price).toFixed(2)} ({product.discount}%)
                  </div>
                </>
              ) : (
                <div className="price-current">${product.price.toFixed(2)}</div>
              )}
            </div>
            
            <div className="product-stock">
              {product.stock > 10 ? (
                <div className="in-stock">✓ En stock</div>
              ) : product.stock > 0 ? (
                <div className="low-stock">⚠ Pocas unidades disponibles ({product.stock})</div>
              ) : (
                <div className="out-of-stock">✗ Agotado</div>
              )}
            </div>
            
            <div className="product-shipping">
              {product.shippingInfo.free ? (
                <div className="free-shipping">
                  <span className="shipping-icon">🚚</span> Envío gratuito
                </div>
              ) : (
                <div className="shipping-cost">
                  <span className="shipping-icon">🚚</span> Gastos de envío: $X.XX
                </div>
              )}
              <div className="delivery-time">
                <span className="delivery-icon">📦</span> Entrega estimada: {product.shippingInfo.estimatedDelivery}
              </div>
            </div>
            
            <div className="seller-info">
              <span className="seller-label">Vendido por:</span>
              <Link to={`/seller/${encodeURIComponent(product.seller)}`} className="seller-name">
                {product.seller}
              </Link>
              <div className="seller-rating">
                {renderRatingStars(product.sellerRating)}
                <span className="seller-since">Desde {product.sellerSince}</span>
              </div>
            </div>
            
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="quantity-input" 
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                
                {isInCart(product.id) ? (
                  <div className="cart-actions">
                    <div className="in-cart-message">
                      Ya tienes {getItemQuantity(product.id)} unidad(es) en el carrito
                    </div>
                    <button 
                      className="view-cart-btn"
                      onClick={() => navigate('/cart')}
                    >
                      Ver Carrito
                    </button>
                  </div>
                ) : (
                  <div className="cart-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                    >
                      Añadir al Carrito
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={handleBuyNow}
                    >
                      Comprar Ahora
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="product-actions-secondary">
              <button className="action-btn wishlist-btn">
                <span className="action-icon">❤️</span> Añadir a Favoritos
              </button>
              <button className="action-btn compare-btn">
                <span className="action-icon">⚖️</span> Comparar
              </button>
              <button className="action-btn share-btn">
                <span className="action-icon">🔗</span> Compartir
              </button>
            </div>
            
            <div className="product-guarantees">
              <div className="guarantee-item">
                <span className="guarantee-icon">✓</span>
                <div className="guarantee-text">
                  <strong>Garantía:</strong> {product.warranty}
                </div>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">↩️</span>
                <div className="guarantee-text">
                  <strong>Devoluciones:</strong> {product.shippingInfo.returns}
                </div>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">🔒</span>
                <div className="guarantee-text">
                  <strong>Pago seguro:</strong> Información cifrada
                </div>
              </div>
            </div>
            
            <div className="product-payment">
              <div className="payment-label">Métodos de pago:</div>
              <div className="payment-methods">
                {product.paymentOptions.map((method, index) => (
                  <span key={index} className="payment-method">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs de información */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descripción
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Especificaciones
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({reviews.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Preguntas ({questions.length})
            </button>
          </div>
          
          <div className="tabs-content">
            {/* Tab Descripción */}
            {activeTab === 'description' && (
              <div className="tab-description">
                <div className={`description-content ${showMoreDescription ? 'expanded' : ''}`}>
                  {product.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  
                  <div className="features-list">
                    <h3>Características Destacadas</h3>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {product.description.length > 500 && (
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowMoreDescription(!showMoreDescription)}
                  >
                    {showMoreDescription ? 'Mostrar menos' : 'Mostrar más'}
                  </button>
                )}
              </div>
            )}
            
            {/* Tab Especificaciones */}
            {activeTab === 'specifications' && (
              <div className="tab-specifications">
                <div className={`specifications-content ${showMoreSpecs ? 'expanded' : ''}`}>
                  <table className="specs-table">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-name">{spec.name}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {product.specifications.length > 6 && (
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                  >
                    {showMoreSpecs ? 'Mostrar menos' : 'Mostrar más'}
                  </button>
                )}
                
                <div className="certifications">
                  <h3>Certificaciones</h3>
                  <div className="cert-list">
                    {product.certification.map((cert, index) => (
                      <span key={index} className="cert-item">{cert}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab Reseñas */}
            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <div className="reviews-summary">
                  <div className="rating-large">
                    <div className="rating-number">{product.rating}</div>
                    <div className="rating-stars-large">
                      {renderRatingStars(product.rating)}
                    </div>
                    <div className="rating-count-total">
                      Basado en {product.reviewCount} reseñas
                    </div>
                  </div>
                  
                  <div className="rating-breakdown">
                    <div className="breakdown-row">
                      <span className="stars-label">5 estrellas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '70%' }}
                        ></div>
                      </div>
                      <span className="percentage">70%</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="stars-label">4 estrellas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '20%' }}
                        ></div>
                      </div>
                      <span className="percentage">20%</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="stars-label">3 estrellas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '7%' }}
                        ></div>
                      </div>
                      <span className="percentage">7%</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="stars-label">2 estrellas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '2%' }}
                        ></div>
                      </div>
                      <span className="percentage">2%</span>
                    </div>
                    <div className="breakdown-row">
                      <span className="stars-label">1 estrella</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '1%' }}
                        ></div>
                      </div>
                      <span className="percentage">1%</span>
                    </div>
                  </div>
                </div>
                
                <div className="reviews-actions">
                  <button 
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Escribir una reseña
                  </button>
                </div>
                
                {showReviewForm && (
                  <div className="review-form-container">
                    <h3>Escribe tu reseña</h3>
                    <form onSubmit={handleReviewSubmit} className="review-form">
                      <div className="form-group">
                        <label>Valoración</label>
                        <div className="rating-selector">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              className={`star-btn ${reviewForm.rating >= star ? 'selected' : ''}`}
                              onClick={() => setReviewForm({...reviewForm, rating: star})}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nombre</label>
                          <input 
                            type="text" 
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            value={reviewForm.email}
                            onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Comentario</label>
                        <textarea 
                          rows="4"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="submit-btn">
                          Enviar Reseña
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-author-info">
                            <div className="review-author">{review.author}</div>
                            {review.verified && (
                              <div className="verified-badge">Compra verificada</div>
                            )}
                          </div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        
                        <div className="review-rating">
                          {renderRatingStars(review.rating)}
                        </div>
                        
                        <div className="review-content">
                          {review.comment}
                        </div>
                        
                        <div className="review-actions">
                          <button className="helpful-btn">
                            Útil ({review.helpful})
                          </button>
                          <button className="report-btn">
                            Reportar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>Aún no hay reseñas para este producto.</p>
                      <button 
                        className="write-review-btn"
                        onClick={() => setShowReviewForm(true)}
                      >
                        Sé el primero en escribir una reseña
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Tab Preguntas */}
            {activeTab === 'questions' && (
              <div className="tab-questions">
                <div className="questions-actions">
                  <button 
                    className="ask-question-btn"
                    onClick={() => setShowQuestionForm(!showQuestionForm)}
                  >
                    Hacer una pregunta
                  </button>
                </div>
                
                {showQuestionForm && (
                  <div className="question-form-container">
                    <h3>Hacer una pregunta sobre este producto</h3>
                    <form onSubmit={handleQuestionSubmit} className="question-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nombre</label>
                          <input 
                            type="text" 
                            value={questionForm.name}
                            onChange={(e) => setQuestionForm({...questionForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            value={questionForm.email}
                            onChange={(e) => setQuestionForm({...questionForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Tu pregunta</label>
                        <textarea 
                          rows="4"
                          value={questionForm.question}
                          onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={() => setShowQuestionForm(false)}
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="submit-btn">
                          Enviar Pregunta
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="questions-list">
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <div key={question.id} className="question-card">
                        <div className="question-content">
                          <div className="question-header">
                            <div className="question-icon">P:</div>
                            <div className="question-text">{question.question}</div>
                          </div>
                          <div className="question-meta">
                            Preguntado por {question.author} - {question.date}
                          </div>
                        </div>
                        
                        {question.answer && (
                          <div className="answer-content">
                            <div className="answer-header">
                              <div className="answer-icon">R:</div>
                              <div className="answer-text">{question.answer}</div>
                            </div>
                            <div className="answer-meta">
                              Respondido por {question.answeredBy} - {question.answerDate}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-questions">
                      <p>Aún no hay preguntas sobre este producto.</p>
                      <button 
                        className="ask-question-btn"
                        onClick={() => setShowQuestionForm(true)}
                      >
                        Sé el primero en hacer una pregunta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Productos relacionados */}
        <div className="related-products">
          <h2>Productos relacionados</h2>
          <div className="related-products-grid">
            {relatedProducts.map((product) => (
              <div 
                key={product.id} 
                className="related-product-card"
                onClick={() => navigate(`/catalog/product/${product.id}`)}
              >
                <div className="related-product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="image-placeholder small">
                      <span>{product.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="related-product-info">
                  <div className="related-product-category">{product.category}</div>
                  <h3 className="related-product-name">{product.name}</h3>
                  <div className="related-product-rating">
                    {renderRatingStars(product.rating)}
                  </div>
                  <div className="related-product-price">${product.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;