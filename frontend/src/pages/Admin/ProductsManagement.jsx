// frontend/src/pages/Admin/ProductsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import ProductsFilter from './components/ProductsFilter';
import ProductsTable from './components/ProductsTable';
import ProductsActions from './subcomponents/ProductsActions';
import ConfirmationModal from './subcomponents/ConfirmationModal';
import '../../styles/Admin.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  
  // Estados para modales
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Datos de ejemplo para categorías
  const categories = [
    'Herramientas Eléctricas',
    'Herramientas Manuales',
    'Material de Construcción',
    'Seguridad',
    'Fontanería',
    'Electricidad'
  ];

  // Cargar productos (simulado)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Simulación de carga desde API
      setTimeout(() => {
        const mockProducts = [];
        
        // Generar 50 productos de ejemplo
        for (let i = 1; i <= 50; i++) {
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          const randomStatus = Math.random() > 0.2 ? 'active' : (Math.random() > 0.5 ? 'out_of_stock' : 'disabled');
          const randomPrice = (Math.random() * 500 + 10).toFixed(2);
          const randomStock = randomStatus === 'out_of_stock' ? 0 : Math.floor(Math.random() * 100 + 1);
          
          mockProducts.push({
            id: i,
            name: `Producto de Construcción ${i}`,
            sku: `SKU-${1000 + i}`,
            price: parseFloat(randomPrice),
            originalPrice: parseFloat(randomPrice) * (Math.random() > 0.7 ? 1.2 : 1),
            stock: randomStock,
            category: randomCategory,
            status: randomStatus,
            featured: Math.random() > 0.8,
            image: null,
            seller: Math.random() > 0.5 ? 'ConstructMax' : 'ToolMaster',
            dateAdded: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString().split('T')[0]
          });
        }
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      }, 1000);
    };
    
    fetchProducts();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];
    
    // Filtrar por búsqueda
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Filtrar por estado
    if (statusFilter) {
      result = result.filter(product => product.status === statusFilter);
    }
    
    // Ordenar productos
    switch (sortBy) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'stock_asc':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock_desc':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Calcular productos paginados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Seleccionar/deseleccionar todos los productos
  const toggleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(product => product.id));
    }
  };
  
  // Seleccionar/deseleccionar un producto
  const toggleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Abrir confirmación para eliminar producto
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };
  
  // Eliminar productos seleccionados
  const deleteSelected = () => {
    setProducts(products.filter(product => !selectedProducts.includes(product.id)));
    setSelectedProducts([]);
  };
  
  // Eliminar un producto específico
  const deleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(product => product.id !== productToDelete.id));
      setShowDeleteConfirmation(false);
      setProductToDelete(null);
    }
  };
  
  // Actualizar estado de productos seleccionados
  const updateSelectedStatus = (status) => {
    setProducts(products.map(product => {
      if (selectedProducts.includes(product.id)) {
        return { ...product, status };
      }
      return product;
    }));
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      
      <div className="admin-content">
        <AdminHeader title="Gestión de Productos" />
        
        <div className="content-header">
          <h2>Todos los Productos ({filteredProducts.length})</h2>
          <Link to="/admin/products/create" className="primary-btn">
            <span className="btn-icon">+</span> Añadir Producto
          </Link>
        </div>
        
        <ProductsFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        {selectedProducts.length > 0 && (
          <ProductsActions 
            selectedCount={selectedProducts.length}
            onDelete={deleteSelected}
            onUpdateStatus={updateSelectedStatus}
          />
        )}
        
        <ProductsTable 
          products={currentProducts}
          loading={loading}
          selectedProducts={selectedProducts}
          onSelectAll={toggleSelectAll}
          onSelectProduct={toggleSelectProduct}
          onDelete={confirmDelete}
        />
        
        {/* Paginación */}
        <div className="pagination">
          <button 
            className="page-btn prev" 
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            ← Anterior
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="page-btn next"
            disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
            onClick={() => paginate(currentPage + 1)}
          >
            Siguiente →
          </button>
        </div>
        
        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirmation && (
          <ConfirmationModal 
            title="Eliminar Producto"
            message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            cancelText="Cancelar"
            onConfirm={deleteProduct}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;