import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManagementSidebar from './components/ManagementSidebar';
import ProductsTable from './components/ProductsTable';
import ProductForm from './components/ProductForm';
import ConfirmationModal from './subcomponents/ConfirmationModal';
import * as productService from '../../services/productService';
import { getImageUrl } from '../../services/fileService';
import '../../styles/ProductManagement.css';

const ProductManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, user } = useAuth();
  
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Estado para modales de formulario
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Estado para confirmación de eliminación
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Categorías recibidas de la API
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);

  // Verificar autenticación y rol
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/products' } } });
    } else if (!isSeller) {
      navigate('/');
    }
  }, [isAuthenticated, isSeller, navigate]);

  // Procesar productos para asegurar que las imágenes tengan URLs completas
  const processProductImages = (products) => {
    return products.map(product => ({
      ...product,
      // Asegurar que la imagen tenga la URL completa para acceder desde el backend
      image: product.image ? getImageUrl(product.image) : null
    }));
  };

  // Cargar productos y categorías
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Cargar categorías
        const categoriesData = await productService.getCategories();
        const transformedCategories = productService.transformApiCategories(categoriesData);
        setCategories(transformedCategories);
        setCategoryNames(transformedCategories.map(cat => cat.name));
        
        // Cargar productos del vendedor
        const productsData = await productService.getSellerProducts();
        
        // Transformar datos de la API al formato del componente
        let transformedProducts = productsData.map(product => 
          productService.transformApiProduct(product)
        );
        
        // Procesar las imágenes para asegurar que tengan URLs completas
        transformedProducts = processProductImages(transformedProducts);
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los productos. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
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
    
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  // Manejar cambio en la búsqueda
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Manejar cambio en filtro de categoría
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  // Abrir modal para añadir producto
  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  // Abrir modal para editar producto
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Confirmar eliminación de producto
  const handleDeleteConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };

  // Eliminar producto
  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      
      // Actualizar estado local tras eliminar con éxito
      setProducts(products.filter(product => product.id !== productToDelete.id));
      setShowDeleteConfirmation(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Guardar nuevo producto
  const handleSaveNewProduct = async (productData) => {
    setLoading(true);
    try {
      // Obtener IDs de categorías seleccionadas
      const categoryId = categories.find(cat => cat.name === productData.category)?.id;
      const dataWithCategoryIds = {
        ...productData,
        categoryIds: categoryId ? [categoryId] : []
      };
      
      const response = await productService.createProduct(dataWithCategoryIds);
      
      // Transformar respuesta de la API al formato del componente
      let newProduct = productService.transformApiProduct(response);
      
      // Asegurar URL completa para la imagen
      newProduct = {
        ...newProduct,
        image: newProduct.image ? getImageUrl(newProduct.image) : null
      };
      
      // Actualizar estado local
      setProducts([...products, newProduct]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('Error al crear el producto. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto existente
  const handleUpdateProduct = async (productData) => {
    setLoading(true);
    try {
      // Obtener IDs de categorías seleccionadas
      const categoryId = categories.find(cat => cat.name === productData.category)?.id;
      const dataWithCategoryIds = {
        ...productData,
        categoryIds: categoryId ? [categoryId] : []
      };
      
      await productService.updateProduct(productData.id, dataWithCategoryIds);
      
      // Si hay una nueva imagen, la añadimos
      if (productData.image && productData.image !== currentProduct.image) {
        await productService.addProductImage(productData.id, productData.image);
      }
      
      // Actualizar estado local
      const updatedProduct = {
        ...productData,
        image: productData.image ? getImageUrl(productData.image) : null
      };
      
      const updatedProducts = products.map(product => 
        product.id === productData.id ? updatedProduct : product
      );
      
      setProducts(updatedProducts);
      setShowEditModal(false);
      setCurrentProduct(null);
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      setError('Error al actualizar el producto. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modales
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentProduct(null);
  };

  return (
    <div className="product-management-container">
      <ManagementSidebar />
      
      <div className="product-management-content">
        <header className="content-header">
          <h1>Administración de Productos</h1>
          <div className="user-info">
            <span>{user?.first_name} {user?.last_name}</span>
            <div className="user-avatar">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          </div>
        </header>
        
        {error && (
          <div className="error-message" style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', margin: '0 0 20px' }}>
            {error}
          </div>
        )}
        
        <ProductsTable 
          products={filteredProducts}
          loading={loading}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteConfirm}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          categories={categoryNames}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
        />
        
        {/* Modal para añadir nuevo producto */}
        {showAddModal && (
          <ProductForm 
            onSave={handleSaveNewProduct}
            onCancel={handleCloseModal}
            categories={categoryNames}
            title="Añadir Nuevo Producto"
          />
        )}
        
        {/* Modal para editar producto */}
        {showEditModal && currentProduct && (
          <ProductForm 
            product={currentProduct}
            onSave={handleUpdateProduct}
            onCancel={handleCloseModal}
            categories={categoryNames}
            title="Editar Producto"
          />
        )}
        
        {/* Modal de confirmación para eliminar */}
        {showDeleteConfirmation && productToDelete && (
          <ConfirmationModal
            title="Eliminar Producto"
            message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete.name}"?`}
            confirmText="Eliminar"
            cancelText="Cancelar"
            onConfirm={handleDeleteProduct}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagement;