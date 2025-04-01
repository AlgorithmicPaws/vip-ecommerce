// frontend/src/pages/Admin/subcomponents/StatCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, period, trend, icon, link }) => {
  return (
    <Link to={link} className="stat-card">
      <div className="stat-icon">{icon}</div>
      
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
        
        <div className={`stat-change ${trend}`}>
          <span className="change-value">{change}</span>
          <span className="change-period">{period}</span>
          <span className="trend-arrow">
            {trend === 'up' ? '↑' : '↓'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StatCard;