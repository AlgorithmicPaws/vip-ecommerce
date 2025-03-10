import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductManagement.css';

const ProductManagement = () => {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null
  });

  // Categorías de ejemplo
  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes'];

  // Simular carga de productos
  useEffect(() => {
    // En una app real, esto sería una llamada a la API
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

  // Filtrar productos
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

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambio en el filtro de categoría
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Manejar cambios en el formulario de nuevo producto
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e, isNewProduct = true) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (isNewProduct) {
          setNewProduct(prev => ({
            ...prev,
            image: event.target.result
          }));
        } else {
          setCurrentProduct(prev => ({
            ...prev,
            image: event.target.result
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Agregar nuevo producto
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    };
    
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: null
    });
  };

  // Abrir modal de edición
  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Actualizar producto
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    
    const updatedProducts = products.map(product => 
      product.id === currentProduct.id ? currentProduct : product
    );
    
    setProducts(updatedProducts);
    setShowEditModal(false);
    setCurrentProduct(null);
  };

  // Eliminar producto
  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="product-management-container">
      <div className="product-management-sidebar">
        <div className="sidebar-header">
          <h2>Mi Tienda</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><a href="#dashboard">Productos</a></li>
            <li><a href="#orders">Pedidos</a></li>
            <li><a href="#customers">Clientes</a></li>
            <li><a href="#analytics">Analíticas</a></li>
            <li><a href="#settings">Configuración</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/profile" className="profile-link">Mi Perfil</Link>
          <button className="logout-btn-sm">Cerrar Sesión</button>
        </div>
      </div>
      
      <div className="product-management-content">
        <header className="content-header">
          <h1>Administración de Productos</h1>
          <div className="user-info">
            <span>Juan Pérez</span>
            <div className="user-avatar">JP</div>
          </div>
        </header>
        
        <div className="content-actions">
          <div className="search-filters">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="category-filter">
              <select 
                value={categoryFilter} 
                onChange={handleCategoryChange}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className="add-product-btn"
            onClick={() => setShowAddModal(true)}
          >
            Añadir Producto
          </button>
        </div>
        
        <div className="products-table-container">
          {loading ? (
            <div className="loading-indicator">Cargando productos...</div>
          ) : filteredProducts.length > 0 ? (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div className="product-image-small">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <div className="image-placeholder">
                            <span>Sin imagen</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn-sm"
                          onClick={() => handleEditClick(product)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn-sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-products">
              No se encontraron productos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para añadir nuevo producto */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Añadir Nuevo Producto</h2>
              <button 
                className="close-modal"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Imagen del Producto</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {newProduct.image ? (
                      <img src={newProduct.image} alt="Vista previa" />
                    ) : (
                      <div className="image-placeholder">
                        <span>Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal para editar producto */}
      {showEditModal && currentProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Producto</h2>
              <button 
                className="close-modal"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="category"
                    value={currentProduct.category}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={currentProduct.stock}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleEditChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Imagen del Producto</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {currentProduct.image ? (
                      <img src={currentProduct.image} alt="Vista previa" />
                    ) : (
                      <div className="image-placeholder">
                        <span>Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Actualizar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;