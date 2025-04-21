import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext';
import '../styles/ProductDetail.css';

// Importaciones de componentes
import Breadcrumbs from './ProductDetail/Breadcrumbs';
import MainImage from './ProductDetail/MainImage';
import ThumbnailContainer from './ProductDetail/ThumbnailContainer';
import ProductMeta from './ProductDetail/ProductMeta';
import ProductPriceContainer from './ProductDetail/ProductPriceContainer';
import ProductStock from './ProductDetail/ProductStock';
import AddToCart from './ProductDetail/AddToCart';
import CartActions from './ProductDetail/CartActions';
import ProductActionsSecondary from './ProductDetail/ProductActionsSecondary';
import SellerInfo from './ProductDetail/SellerInfo';
import ProductShipping from './ProductDetail/ProductShipping';
import ProductPayment from './ProductDetail/ProcuctPayment';
import Productguarantees from './ProductDetail/Productguarantees';
import TabsHeader from './ProductDetail/TabsHeader';
import TabsDescription from './ProductDetail/TabsDescription';
import TabSpecifications from './ProductDetail/TabSpecifications';
import ReviewsSummary from './ProductDetail/ReviewsSummary';
import ReviewsActions from './ProductDetail/ReviewsActions';
import ReviewFormContainer from './ProductDetail/ReviewFormContainer';
import ReviewsList from './ProductDetail/ReviewsList';
import QuestionsActions from './ProductDetail/QuestionsActions';
import FormGroup from './ProductDetail/FormGroup';
import FormGroupEmail from './ProductDetail/FormGroupEmail';
import FormGroupQuestion from './ProductDetail/FormGroupQuestion';
import FormActionsSubmit from './ProductDetail/FormActionsSubmit';
import Questioncontent from './ProductDetail/Questioncontent';
import AnswerContent from './ProductDetail/AnswerContent';
import NoQuestions from './ProductDetail/NoQuestions';
import RelatedProductImage from './ProductDetail/RelatedProductImage';
import RelatedProductInfo from './ProductDetail/RelatedProductInfo';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Estados para formularios
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  
  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    question: "",
  });
  
  // Cargar datos del producto
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulación de carga desde API
        setTimeout(() => {
          // Mock de un producto
          const mockProduct = {
            id: productId,
            name: "Taladro Percutor Profesional 18V",
            category: "Herramientas Eléctricas",
            subcategory: "Taladros",
            brand: "DeWalt",
            model: "DCD778-XJ",
            sku: "DW-12345",
            price: 149.99,
            originalPrice: 199.99,
            discount: 25,
            stock: 15,
            rating: 4.7,
            reviewCount: 124,
            seller: "ConstructMax",
            sellerRating: 4.9,
            sellerSince: "2015",
            images: [null, null, null], // Aquí irían las URLs de las imágenes reales
            description: "Taladro percutor a batería de 18V con motor sin escobillas que proporciona hasta un 50% más de autonomía. Portabrocas metálico de cierre rápido de 13mm. 2 velocidades variables y reversibles. Capacidad de perforación en madera: 30mm, en metal: 13mm y en mampostería: 13mm. Luz LED para iluminar el área de trabajo.\n\nIncluye: Taladro percutor, 2 baterías de 2Ah, cargador, maletín, disco de 24 dientes, llave, guía paralela.",
            features: [
              "Motor sin escobillas de alta eficiencia",
              "2 velocidades: 0-500/0-2000rpm",
              "Luz LED integrada",
              "Par máximo de 65Nm",
              "Batería de ion de litio compatible con toda la gama XR 18V"
            ],
            specifications: [
              { name: "Voltaje", value: "18V" },
              { name: "Tipo de batería", value: "Li-Ion" },
              { name: "Capacidad de batería", value: "2.0Ah" },
              { name: "Velocidad sin carga", value: "0-500/0-2000rpm" },
              { name: "Par máximo", value: "65Nm" },
              { name: "Capacidad portabrocas", value: "13mm" },
              { name: "Peso", value: "1.6Kg" },
              { name: "Dimensiones", value: "230 x 90 x 240mm" }
            ],
            certification: ["CE", "RoHS", "ISO 9001"],
            warranty: "3 años de garantía del fabricante",
            paymentOptions: ["Tarjeta de crédito", "PayPal", "Transferencia", "Contrareembolso"],
            shippingInfo: {
              free: true,
              estimatedDelivery: "2-3 días laborables",
              returns: "30 días"
            }
          };
          
          // Mock de reviews
          const mockReviews = [
            {
              id: 1,
              author: "Carlos Martínez",
              date: "15 mar 2023",
              rating: 5,
              comment: "Excelente herramienta. Potente, precisa y la batería dura bastante. Perfecta para trabajos de carpintería profesional.",
              helpful: 8,
              verified: true
            },
            {
              id: 2,
              author: "Antonio López",
              date: "28 feb 2023",
              rating: 4,
              comment: "Muy buena sierra, aunque un poco pesada para mi gusto. La potencia es impresionante y los cortes son muy limpios.",
              helpful: 3,
              verified: true
            },
            {
              id: 3,
              author: "María Gómez",
              date: "10 feb 2023",
              rating: 5,
              comment: "Perfecto para mis necesidades. Fácil de usar y muy manejable.",
              helpful: 5,
              verified: false
            }
          ];
          
          // Mock de preguntas
          const mockQuestions = [
            {
              id: 1,
              author: "Pedro Sánchez",
              date: "15 feb 2023",
              question: "¿Es compatible con discos de otras marcas?",
              answer: "Sí, es compatible con cualquier disco estándar de 184mm, siempre que cumpla con las especificaciones de seguridad.",
              answeredBy: "ConstructMax",
              answerDate: "16 feb 2023"
            },
            {
              id: 2,
              author: "Laura Fernández",
              date: "20 feb 2023",
              question: "¿Viene con maletín de transporte?",
              answer: "Sí, incluye un maletín resistente DeWalt con espacio para la herramienta, baterías y accesorios.",
              answeredBy: "Soporte DeWalt",
              answerDate: "22 feb 2023"
            }
          ];
          
          // Productos relacionados
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
          
          setProduct(mockProduct);
          setReviews(mockReviews);
          setQuestions(mockQuestions);
          setRelatedProducts(mockRelatedProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("No se pudo cargar el producto. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (operation) => {
    if (operation === 'increase' && quantity < product?.stock) {
      setQuantity(prev => prev + 1);
    } else if (operation === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Manejar añadir al carrito
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  // Manejar compra directa
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };
  
  // Manejar envío de reseña
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", reviewForm);
    
    // Aquí iría la lógica para enviar la reseña a la API
    // Simulamos añadir la reseña al estado local
    const newReview = {
      id: reviews.length + 1,
      author: reviewForm.name,
      date: new Date().toLocaleDateString(),
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      helpful: 0,
      verified: false
    };
    
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setReviewForm({
      name: "",
      email: "",
      rating: 5,
      comment: ""
    });
  };
  
  // Manejar envío de pregunta
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    console.log("Question submitted:", questionForm);
    
    // Aquí iría la lógica para enviar la pregunta a la API
    // Simulamos añadir la pregunta al estado local
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
      name: "",
      email: "",
      question: ""
    });
  };
  
  // Renderizar estrellas para el rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Ha ocurrido un error</h2>
          <p>{error || "No se pudo cargar el producto"}</p>
          <button onClick={() => navigate("/catalog")} className="primary-btn">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Breadcrumbs */}
        <Breadcrumbs product={product} />
        
        <div className="product-main">
          <div className="product-gallery">
            {/* Imagen principal */}
            <MainImage product={product} selectedImage={selectedImage} />
            
            {/* Miniaturas */}
            <ThumbnailContainer 
              product={product} 
              selectedImage={selectedImage} 
              setSelectedImage={setSelectedImage} 
            />
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Metadatos del producto */}
            <ProductMeta product={product} renderRatingStars={renderRatingStars} />
            
            {/* Precio */}
            <ProductPriceContainer product={product} />
            
            {/* Stock */}
            <ProductStock product={product} />
            
            {/* Selector de cantidad */}
            <div className="quantity-selector">
              <span className="quantity-label">Cantidad:</span>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Botones de acción */}
            {isInCart(product.id) ? (
              <CartActions 
                product={product} 
                navigate={navigate} 
                getItemQuantity={getItemQuantity} 
              />
            ) : (
              <AddToCart 
                handleAddToCart={handleAddToCart} 
                handleBuyNow={handleBuyNow} 
              />
            )}
            
            {/* Acciones secundarias */}
            <ProductActionsSecondary />
            
            {/* Información del vendedor */}
            <SellerInfo product={product} renderRatingStars={renderRatingStars} />
            
            {/* Información de envío */}
            <ProductShipping product={product} />
            
            {/* Información de pago */}
            <ProductPayment product={product} />
            
            {/* Garantías */}
            <Productguarantees product={product} />
          </div>
        </div>
        
        {/* Pestañas de información */}
        <div className="product-tabs">
          <TabsHeader 
            questions={questions} 
            activeTab={activeTab} 
            reviews={reviews} 
            setActiveTab={setActiveTab} 
          />
          
          <div className="tabs-content">
            {/* Pestaña de descripción */}
            {activeTab === "description" && (
              <TabsDescription 
                product={product} 
                showMoreDescription={showMoreDescription} 
                setShowMoreDescription={setShowMoreDescription} 
              />
            )}
            
            {/* Pestaña de especificaciones */}
            {activeTab === "specifications" && (
              <TabSpecifications 
                product={product} 
                showMoreSpecs={showMoreSpecs} 
                setShowMoreSpecs={setShowMoreSpecs} 
              />
            )}
            
            {/* Pestaña de reseñas */}
            {activeTab === "reviews" && (
              <div className="tab-reviews">
                <ReviewsSummary product={product} renderRatingStars={renderRatingStars} />
                
                <ReviewsActions 
                  setShowReviewForm={setShowReviewForm} 
                  showReviewForm={showReviewForm} 
                />
                
                {showReviewForm && (
                  <ReviewFormContainer 
                    reviewForm={reviewForm} 
                    setReviewForm={setReviewForm} 
                    handleReviewSubmit={handleReviewSubmit} 
                    setShowReviewForm={setShowReviewForm} 
                  />
                )}
                
                <ReviewsList 
                  reviews={reviews} 
                  renderRatingStars={renderRatingStars} 
                  setShowReviewForm={setShowReviewForm} 
                />
              </div>
            )}
            
            {/* Pestaña de preguntas */}
            {activeTab === "questions" && (
              <div className="tab-questions">
                <QuestionsActions 
                  showQuestionForm={showQuestionForm} 
                  setShowQuestionForm={setShowQuestionForm} 
                />
                
                {showQuestionForm && (
                  <div className="question-form-container">
                    <h3>Hacer una pregunta sobre este producto</h3>
                    <form onSubmit={handleQuestionSubmit} className="question-form">
                      <div className="form-row">
                        <FormGroup 
                          questionForm={questionForm} 
                          setQuestionForm={setQuestionForm} 
                        />
                        <FormGroupEmail 
                          questionForm={questionForm} 
                          setQuestionForm={setQuestionForm} 
                        />
                      </div>
                      
                      <FormGroupQuestion 
                        questionForm={questionForm} 
                        setQuestionForm={setQuestionForm} 
                      />
                      
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
                        <Questioncontent question={question} />
                        
                        {question.answer && (
                          <AnswerContent question={question} />
                        )}
                      </div>
                    ))
                  ) : (
                    <NoQuestions setShowQuestionForm={setShowQuestionForm} />
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
                <RelatedProductImage product={product} />
                <RelatedProductInfo product={product} renderRatingStars={renderRatingStars} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;