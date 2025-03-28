import React, { useState, useEffect } from 'react';
import ManagementSidebar from './components/ManagementSidebar';
import ProductsTable from './components/ProductsTable';
import ProductForm from './components/ProductForm';
import ConfirmationModal from './subcomponents/ConfirmationModal';
import '../../styles/ProductManagement.css';

const ProductManagement = () => {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  // Categorías de ejemplo
  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Construcción'];

  // Cargar productos iniciales
  useEffect(() => {
    // Simulación de carga desde API
    setLoading(true);
    setTimeout(() => {
      const mockProducts = [
        { 
          id: 1, 
          name: 'Smartphone XYZ', 
          price: 499.99, 
          stock: 25, 
          category: 'Electrónica',
          description: 'Smartphone de última generación con cámara de alta resolución',
          image: null
        },
        { 
          id: 2, 
          name: 'Laptop Pro', 
          price: 1299.99, 
          stock: 10, 
          category: 'Electrónica',
          description: 'Laptop potente para trabajo profesional y gaming',
          image: null
        },
        { 
          id: 3, 
          name: 'Zapatillas Runner', 
          price: 89.99, 
          stock: 50, 
          category: 'Deportes',
          description: 'Zapatillas cómodas para correr largas distancias',
          image: null
        },
        { 
          id: 4, 
          name: 'Camiseta Casual', 
          price: 24.99, 
          stock: 100, 
          category: 'Ropa',
          description: 'Camiseta de algodón 100%, disponible en varios colores',
          image: null
        },
        { 
          id: 5, 
          name: 'Juego de Sartenes', 
          price: 79.99, 
          stock: 15, 
          category: 'Hogar',
          description: 'Set de 3 sartenes antiadherentes de alta calidad',
          image: null
        }
      ];

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
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
  const handleDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id));
    setShowDeleteConfirmation(false);
    setProductToDelete(null);
  };

  // Guardar nuevo producto
  const handleSaveNewProduct = (productData) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
      ...productData,
      id: newId,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock)
    };
    
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  // Actualizar producto existente
  const handleUpdateProduct = (productData) => {
    const updatedProducts = products.map(product => 
      product.id === productData.id ? productData : product
    );
    
    setProducts(updatedProducts);
    setShowEditModal(false);
    setCurrentProduct(null);
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
            <span>Juan Pérez</span>
            <div className="user-avatar">JP</div>
          </div>
        </header>
        
        <ProductsTable 
          products={filteredProducts}
          loading={loading}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteConfirm}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
        />
        
        {/* Modal para añadir nuevo producto */}
        {showAddModal && (
          <ProductForm 
            onSave={handleSaveNewProduct}
            onCancel={handleCloseModal}
            categories={categories}
            title="Añadir Nuevo Producto"
          />
        )}
        
        {/* Modal para editar producto */}
        {showEditModal && currentProduct && (
          <ProductForm 
            product={currentProduct}
            onSave={handleUpdateProduct}
            onCancel={handleCloseModal}
            categories={categories}
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