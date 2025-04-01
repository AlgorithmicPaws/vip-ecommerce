// frontend/src/pages/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import TopProducts from './components/TopProducts';
import AdminHeader from './components/AdminHeader';
import AlertBanner from './subcomponents/AlertBanner';
import SalesByCategory from './components/SalesByCategory';
import '../../styles/Admin.css';

const AdminDashboard = () => {
  // Estado para alertas del sistema
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Hay 5 productos con bajo stock que requieren atención',
      link: '/admin/inventory?filter=low-stock'
    },
    {
      id: 2,
      type: 'info',
      message: 'Se han registrado 15 nuevos vendedores esta semana',
      link: '/admin/sellers?filter=new'
    }
  ]);

  // Datos para gráficos (simulados)
  const salesData = [
    { name: 'Ene', ventas: 12400 },
    { name: 'Feb', ventas: 15600 },
    { name: 'Mar', ventas: 14200 },
    { name: 'Abr', ventas: 16800 },
    { name: 'May', ventas: 18200 },
    { name: 'Jun', ventas: 17500 },
    { name: 'Jul', ventas: 19800 },
    { name: 'Ago', ventas: 22400 },
    { name: 'Sep', ventas: 21200 },
    { name: 'Oct', ventas: 23500 },
    { name: 'Nov', ventas: 26800 },
    { name: 'Dic', ventas: 29400 }
  ];

  // Datos para gráfico de categorías
  const categoryData = [
    { name: 'Herramientas Eléctricas', value: 35 },
    { name: 'Herramientas Manuales', value: 25 },
    { name: 'Material de Construcción', value: 20 },
    { name: 'Seguridad', value: 10 },
    { name: 'Fontanería', value: 10 }
  ];

  // Cerrar una alerta
  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      
      <div className="admin-content">
        <AdminHeader title="Panel de Control" />
        
        <div className="admin-alerts">
          {alerts.map(alert => (
            <AlertBanner 
              key={alert.id}
              type={alert.type}
              message={alert.message}
              link={alert.link}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </div>
        
        <DashboardStats />
        
        <div className="dashboard-charts">
          <div className="chart-card sales-chart">
            <h3>Ventas Mensuales</h3>
            {/* El componente de gráfico se implementará con recharts */}
          </div>
          
          <div className="chart-card category-chart">
            <h3>Ventas por Categoría</h3>
            <SalesByCategory data={categoryData} />
          </div>
        </div>
        
        <div className="dashboard-tables">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;