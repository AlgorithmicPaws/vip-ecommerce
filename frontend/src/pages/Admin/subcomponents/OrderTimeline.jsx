// frontend/src/pages/Admin/subcomponents/OrderTimeline.jsx
import React from 'react';

const OrderTimeline = ({ history }) => {
  // Ordenar el historial por fecha (más reciente primero)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Formatear fecha y hora
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    
    // Formatear fecha
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Formatear hora
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  // Obtener icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏱️';
      case 'processing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'refunded':
        return '💸';
      default:
        return '📝';
    }
  };

  return (
    <div className="order-timeline">
      {sortedHistory.map((event, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-icon">
            {getStatusIcon(event.status)}
          </div>
          
          <div className="timeline-content">
            <div className="timeline-date">
              {formatDateTime(event.date)}
            </div>
            <div className="timeline-status">
              {event.note}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;