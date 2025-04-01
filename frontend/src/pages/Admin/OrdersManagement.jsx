// frontend/src/pages/Admin/OrdersManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import OrdersFilter from './components/OrdersFilter';
import OrdersTable from './components/OrdersTable';
import '../../styles/Admin.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortBy, setSortBy] = useState('newest');
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Cargar pedidos (simulado)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      
      // Simulación de carga desde API
      setTimeout(() => {
        const mockOrders = [];
        const statuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
        const paymentMethods = ['credit_card', 'paypal', 'transfer', 'cash_on_delivery'];
        
        // Generar 50 pedidos de ejemplo
        for (let i = 1; i <= 50; i++) {
          const orderNumber = `ORD-2025-${1000 + i}`;
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const randomTotal = (Math.random() * 1000 + 50).toFixed(2);
          const randomItems = Math.floor(Math.random() * 10 + 1);
          const randomCustomer = `Cliente ${i}`;
          const randomDaysAgo = Math.floor(Math.random() * 30);
          const randomDate = new Date(Date.now() - randomDaysAgo * 86400000).toISOString().split('T')[0];
          const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
          
          mockOrders.push({
            id: i,
            orderNumber,
            customerName: randomCustomer,
            customerEmail: `cliente${i}@example.com`,
            date: randomDate,
            status: randomStatus,
            total: parseFloat(randomTotal),
            items: randomItems,
            paymentMethod: randomPayment,
            shippingMethod: Math.random() > 0.5 ? 'standard' : 'express',
            notes: Math.random() > 0.7 ? 'Notas del cliente para entrega' : null
          });
        }
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };
    
    fetchOrders();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = [...orders];
    
    // Filtrar por búsqueda
    if (searchQuery) {
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filtrar por rango de fechas
    if (dateRange.from) {
      result = result.filter(order => order.date >= dateRange.from);
    }
    
    if (dateRange.to) {
      result = result.filter(order => order.date <= dateRange.to);
    }
    
    // Ordenar pedidos
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'total_asc':
        result.sort((a, b) => a.total - b.total);
        break;
      case 'total_desc':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }
    
    setFilteredOrders(result);
  }, [orders, searchQuery, statusFilter, dateRange, sortBy]);

  // Calcular pedidos paginados
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Seleccionar/deseleccionar todos los pedidos
  const toggleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order.id));
    }
  };
  
  // Seleccionar/deseleccionar un pedido
  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  // Actualizar estado de pedidos seleccionados
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      
      <div className="admin-content">
        <AdminHeader title="Gestión de Pedidos" />
        
        <div className="content-header">
          <h2>Todos los Pedidos ({filteredOrders.length})</h2>
          <Link to="/admin/orders/new" className="primary-btn">
            <span className="btn-icon">+</span> Crear Pedido
          </Link>
        </div>
        
        <OrdersFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <OrdersTable 
          orders={currentOrders}
          loading={loading}
          selectedOrders={selectedOrders}
          onSelectAll={toggleSelectAll}
          onSelectOrder={toggleSelectOrder}
          onUpdateStatus={updateOrderStatus}
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
            {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
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
            disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
            onClick={() => paginate(currentPage + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;