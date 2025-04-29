// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../pages/CartContext'; // Assuming CartContext is in pages
import * as productService from '../services/productService'; // For product data
import * as sellerService from '../services/sellerService';   // For seller data
import LoadingIndicator from '../pages/ProductCatalog/subcomponents/LoadingIndicator'; // Re-use loading indicator
import Breadcrumbs from './ProductDetail/Breadcrumbs'; // Keep Breadcrumbs
import MainImage from './ProductDetail/MainImage';     // Keep Main Image display
import ThumbnailContainer from './ProductDetail/ThumbnailContainer'; // Keep Thumbnails
import ProductStock from './ProductDetail/ProductStock'; // Keep Stock display
import AddToCart from './ProductDetail/AddToCart';     // Keep Add to Cart button group
import CartActions from './ProductDetail/CartActions';   // Keep View Cart button group
import SellerInfo from './ProductDetail/SellerInfo';   // Keep Seller Info display (will use fetched data)
import '../styles/ProductDetail.css'; // Ensure styles are linked

const ProductDetail = () => {
  const { productId } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // State for fetched data
  const [product, setProduct] = useState(null); // Will hold combined product and seller info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI interaction
  const [selectedImage, setSelectedImage] = useState(0); // Index of the main image shown
  const [quantity, setQuantity] = useState(1);       // Quantity selector value

  // Fetch Product and Seller Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setProduct(null); // Clear previous product data

      try {
        // 1. Fetch Product Data using the service function
        // productService.getProductById already uses transformApiProduct
        const productData = await productService.getProductById(productId);

        if (!productData) {
          throw new Error(`Producto con ID ${productId} no encontrado.`);
        }

        // 2. Fetch Seller Data if product has a sellerId
        let sellerName = "Desconocido"; // Default seller name
        if (productData.sellerId) {
          const sellerData = await sellerService.getSellerById(productData.sellerId);
          // Use business_name based on backend schema, fallback if needed
          if (sellerData && sellerData.business_name) {
            sellerName = sellerData.business_name;
          }
        }

        // 3. Combine product data with the fetched seller name
        setProduct({
          ...productData, // Spread all properties from productData
          seller: sellerName // Overwrite/add the seller name
        });

      } catch (err) {
        console.error("Error loading product detail:", err);
        setError(err.message || "No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]); // Re-fetch if productId changes

  // Handle quantity changes
  const handleQuantityChange = (operation) => {
    if (!product) return;
    if (operation === 'increase' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (operation === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle adding item to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Optional: Show a temporary confirmation message
    }
  };

  // Handle "Buy Now" action
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart'); // Navigate to cart after adding
    }
  };

  // --- Render Logic ---

  // Loading State
  if (loading) {
    return (
      <div className="product-detail-container loading-container">
        <LoadingIndicator message="Cargando producto..." />
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="product-detail-container error-container">
        <h2>Error al Cargar</h2>
        <p>{error || "No se encontró el producto solicitado."}</p>
        <button onClick={() => navigate("/catalog")} className="primary-btn">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Success State - Render Product Details
  const isProductInCart = isInCart(product.id);

  // Helper function to format price (copied from previous examples)
  const formatPrice = (price) => {
      if (typeof price !== 'number' || isNaN(price)) return '$ 0';
      try {
          return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0, minimumFractionDigits: 0 });
      } catch (error) {
          console.error('Error formatting price:', error);
          return '$ ' + Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Breadcrumbs - Pass necessary product info */}
        <Breadcrumbs product={{ name: product.name, category: product.category }} />

        <div className="product-main">
          {/* Product Gallery */}
          <div className="product-gallery">
            {/* Main Image - Pass only needed props */}
            <MainImage product={{ images: product.images, name: product.name }} selectedImage={selectedImage} />

            {/* Thumbnails - Pass only needed props */}
            <ThumbnailContainer
              product={{ images: product.images }}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Product Title */}
            <h1 className="product-title">{product.name}</h1>

            {/* Basic Meta Info (Category, Seller) */}
             <p className="detail-category">
                Categoría: <Link to={`/catalog?category=${encodeURIComponent(product.category)}`}>{product.category || 'N/A'}</Link>
             </p>
             {/* Seller Info Component - Pass fetched seller name */}
             <SellerInfo product={{ seller: product.seller, sellerId: product.sellerId /* Pass ID if needed for link */ }} renderRatingStars={() => null} /* Pass dummy function or remove if SellerInfo doesn't need it */ />


            {/* Price */}
            <div className="product-price-container">
                <div className="price-current">{formatPrice(product.price)}</div>
                {/* Add logic here if your API *does* return originalPrice/discount */}
            </div>

            {/* Stock Status */}
            <ProductStock product={{ stock: product.stock }} />

            {/* Quantity Selector */}
            {product.stock > 0 && (
                <div className="quantity-selector">
                <span className="quantity-label">Cantidad:</span>
                <div className="quantity-controls">
                    <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    > - </button>
                    <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => { // Allow direct input but validate
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= product.stock) {
                            setQuantity(val);
                        } else if (e.target.value === '') {
                            setQuantity(1); // Reset to 1 if cleared
                        }
                    }}
                    className="quantity-input"
                    />
                    <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.stock}
                    > + </button>
                </div>
                </div>
            )}

            {/* Cart Actions */}
            {isProductInCart ? (
              <CartActions
                product={{ id: product.id }} // Pass only needed ID
                navigate={navigate}
                getItemQuantity={getItemQuantity}
              />
            ) : product.stock > 0 ? (
              <AddToCart
                handleAddToCart={handleAddToCart}
                handleBuyNow={handleBuyNow}
              />
            ) : (
                 <button className="out-of-stock-btn" disabled>Producto Agotado</button>
            )}

            {/* Simplified Description */}
            <div className="product-tabs"> {/* Re-use tabs container for structure */}
                <div className="tabs-header">
                    <button className="tab-btn active">Descripción</button>
                    {/* Add other tabs back if/when APIs are available */}
                </div>
                <div className="tabs-content">
                    <div className="tab-description">
                        {/* Display full description */}
                        {product.description ? (
                             product.description.split("\n\n").map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))
                        ) : (
                            <p>No hay descripción disponible para este producto.</p>
                        )}
                    </div>
                </div>
            </div>

          </div> {/* End product-info */}
        </div> {/* End product-main */}

        {/* Removed Related Products Section */}

      </div> {/* End product-detail-content */}
    </div> // End product-detail-container
  );
};

export default ProductDetail;
