import React from 'react';

const SellWithUs = ({ navigate }) => {
  return (
    <section className="sell-with-us-section">
      <div className="sell-content">
        <div className="sell-text">
          <h2>¿Eres proveedor de materiales o herramientas de construcción?</h2>
          <p>Únete a ConstructMarket y accede a miles de profesionales y empresas constructoras en toda España.</p>
          <ul className="benefits-list">
            <li><span className="benefit-icon">💰</span> Aumenta tus ventas</li>
            <li><span className="benefit-icon">🔍</span> Mayor visibilidad</li>
            <li><span className="benefit-icon">📊</span> Gestión simplificada</li>
            <li><span className="benefit-icon">💳</span> Pagos seguros</li>
          </ul>
          <button 
            onClick={() => navigate("/sell")} 
            className="become-seller-btn"
          >
            Empieza a vender
          </button>
        </div>
        <div className="sell-image">
          <div className="image-placeholder">
            <span>🛒</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellWithUs;