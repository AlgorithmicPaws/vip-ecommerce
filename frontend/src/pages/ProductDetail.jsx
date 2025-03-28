import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import '../styles/ProductDetail.css';
import ProductDetailContainer from './ProductDetail/ProductDetailContainer';
import Breadcrumbs from './ProductDetail/Breadcrumbs';
import MainImage from './ProductDetail/MainImage';
import ThumbnailContainer from './ProductDetail/ThumbnailContainer';
import ProductMeta from './ProductDetail/ProductMeta';
import ProductPriceContainer from './ProductDetail/ProductPriceContainer';
import ProductStock from './ProductDetail/ProductStock';
import ProductShipping from './ProductDetail/ProductShipping';
import SellerInfo from './ProductDetail/SellerInfo';
import CartActions from './ProductDetail/CartActions';
import AddToCart from './ProductDetail/AddToCart';
import ProductActionsSecondary from './ProductDetail/ProductActionsSecondary';
import Productguarantees from './ProductDetail/Productguarantees';
import ProcuctPayment from './ProductDetail/ProcuctPayment';
import TabsHeader from './ProductDetail/TabsHeader';
import TabsDescription from './ProductDetail/TabsDescription';
import TabSpecifications from './ProductDetail/TabSpecifications';
import ReviewsSummary from './ProductDetail/ReviewsSummary';
import ReviewsActions from './ProductDetail/ReviewsActions';
import ReviewFormContainer from './ProductDetail/ReviewFormContainer';
import ReviewsList from './ProductDetail/ReviewsList';
import FormGroup from './ProductDetail/FormGroup';
import FormGroupEmail from './ProductDetail/FormGroupEmail';
import FormGroupQuestion from './ProductDetail/FormGroupQuestion';
import FormActionsSubmit from './ProductDetail/FormActionsSubmit';
import Questioncontent from './ProductDetail/Questioncontent';
import AnswerContent from './ProductDetail/AnswerContent';
import NoQuestions from './ProductDetail/NoQuestions';
import RelatedProductImage from './ProductDetail/RelatedProductImage';
import RelatedProductInfo from './ProductDetail/RelatedProductInfo';
import QuestionsActions from './ProductDetail/QuestionsActions';
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
        <ProductDetailContainer navigate={navigate}/>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        {/* Breadcrumbs */}
        <Breadcrumbs product={product}/>
        
        {/* Contenido principal */}
        <div className="product-main">
          
          {/* Galería de imágenes */}
          
          <div className="product-gallery">
            {/* -------------lo intente poner y no se pq no deja--------------- */}
            <MainImage product={product} selectedImage={selectedImage}/>

            {/* -------------lo intente poner y no se pq no deja--------------- */}
            
            <ThumbnailContainer product={product} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
          </div>
          
          {/* Información del producto */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <ProductMeta product={product} renderRatingStars={renderRatingStars}/>
            
            <ProductPriceContainer product={product}/>
            
            <ProductStock product={product}/>
            
            <ProductShipping product={product}/>
            
            <SellerInfo product={product} renderRatingStars={renderRatingStars} />
            
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
                  <CartActions product={product} navigate={navigate} getItemQuantity={getItemQuantity}/>
                ) : (
                  <AddToCart handleAddToCart={handleAddToCart} handleBuyNow={handleBuyNow}/>
                )}
              </div>
            )}
            
            <ProductActionsSecondary/>
            
            <Productguarantees product={product}/>
            
            <ProcuctPayment product={product}/>
          </div>
        </div>
        
        {/* Tabs de información */}
        <div className="product-tabs">
          <TabsHeader questions={questions} activeTab={activeTab} reviews={reviews} setActiveTab={setActiveTab}/>
          
          <div className="tabs-content">
            {/* Tab Descripción */}
            {activeTab === 'description' && (
              <TabsDescription product={product} showMoreDescription={showMoreDescription} setShowMoreDescription={setShowMoreDescription}/>
            )}
            
            {/* Tab Especificaciones */}
            {activeTab === 'specifications' && (
              <TabSpecifications product={product} showMoreSpecs={showMoreSpecs}/>
            )}
            
            {/* Tab Reseñas */}
            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <ReviewsSummary product={product} renderRatingStars={renderRatingStars}/>
                
                <ReviewsActions setShowReviewForm={setShowReviewForm}  showReviewForm={showReviewForm}/>
                
                {showReviewForm && (
                  <ReviewFormContainer reviewForm={reviewForm} setReviewForm={setReviewForm} handleReviewSubmit={handleReviewSubmit} setShowReviewForm={setShowReviewForm}/>
                )}
                
                <ReviewsList reviews={reviews} renderRatingStars={renderRatingStars} setShowReviewForm={setShowReviewForm}/>
              </div>
            )}
            
            {/* Tab Preguntas */}
            {activeTab === 'questions' && (
              <div className="tab-questions">
                <QuestionsActions showQuestionForm={showQuestionForm} setShowQuestionForm={setShowQuestionForm}/>
                
                {showQuestionForm && (
                  <div className="question-form-container">
                    <h3>Hacer una pregunta sobre este producto</h3>
                    <form onSubmit={handleQuestionSubmit} className="question-form">
                      <div className="form-row">
                        {/**Formgroup name */}
                        <FormGroup questionForm={questionForm} setQuestionForm={setQuestionForm}/>
                        <FormGroupEmail questionForm={questionForm} setQuestionForm={setQuestionForm}/>
                      </div>
                      
                      <FormGroupQuestion questionForm={questionForm} setQuestionForm={setQuestionForm}/>
                      
                      <FormActionsSubmit setShowQuestionForm={setShowQuestionForm}/>
                    </form>
                  </div>
                )}
                
                <div className="questions-list">
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <div key={question.id} className="question-card">
                        <Questioncontent question={question}/>
                        
                        {question.answer && (
                          <AnswerContent question={question}/>
                        )}
                      </div>
                    ))
                  ) : (
                    <NoQuestions setShowQuestionForm={setShowQuestionForm}/>
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
                <RelatedProductImage product={product}/>
                <RelatedProductInfo product={product} renderRatingStars={renderRatingStars}/>
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