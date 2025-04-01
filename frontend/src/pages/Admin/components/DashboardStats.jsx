// frontend/src/pages/Admin/components/DashboardStats.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../subcomponents/StatCard';

const DashboardStats = () => {
  // Datos de estadísticas (simulados)
  const stats = [
    {
      id: 'sales',
      title: 'Ventas Totales',
      value: '$285,429.25',
      change: '+12.5%',
      period: 'vs mes anterior',
      trend: 'up',
      icon: '💰',
      link: '/admin/reports/sales'
    },
    {
      id: 'orders',
      title: 'Pedidos',
      value: '1,245',
      change: '+8.3%',
      period: 'vs mes anterior',
      trend: 'up',
      icon: '📦',
      link: '/admin/orders'
    },
    {
      id: 'customers',
      title: 'Clientes Nuevos',
      value: '356',
      change: '+5.7%',
      period: 'vs mes anterior',
      trend: 'up',
      icon: '👥',
      link: '/admin/customers'
    },
    {
      id: 'conversion',
      title: 'Tasa de Conversión',
      value: '3.8%',
      change: '-0.5%',
      period: 'vs mes anterior',
      trend: 'down',
      icon: '📊',
      link: '/admin/reports/conversion'
    }
  ];

  return (
    <div className="dashboard-stats">
      {stats.map(stat => (
        <StatCard 
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          period={stat.period}
          trend={stat.trend}
          icon={stat.icon}
          link={stat.link}
        />
      ))}
    </div>
  );
};

export default DashboardStats;