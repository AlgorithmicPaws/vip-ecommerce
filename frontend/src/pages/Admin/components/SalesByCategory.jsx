// frontend/src/pages/Admin/components/SalesByCategory.jsx
import React from 'react';

const SalesByCategory = ({ data }) => {
  // Colores para el gráfico de categorías
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="category-chart-container">
      <div className="chart-placeholder">
        {/* En una implementación real, aquí iría el gráfico de pastel con recharts */}
        <div className="chart-mock">
          <div className="chart-center">
            Gráfico
          </div>
        </div>
      </div>
      
      <div className="category-legend">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div 
              className="color-box" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span>{entry.name}: {entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByCategory;