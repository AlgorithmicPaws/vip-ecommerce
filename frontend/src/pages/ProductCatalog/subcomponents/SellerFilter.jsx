import React, { useState } from 'react';

const SellerFilter = ({ onSellerChange }) => {
  const [selectedSellers, setSelectedSellers] = useState([]);

  const sellers = [
    'ConstructMax',
    'MaterialesPro',
    'ToolMaster',
    'SafetyFirst'
  ];

  const handleSellerChange = (seller) => {
    setSelectedSellers(prev => {
      if (prev.includes(seller)) {
        // Si ya está seleccionado, lo quitamos
        const newSelection = prev.filter(item => item !== seller);
        if (onSellerChange) onSellerChange(newSelection);
        return newSelection;
      } else {
        // Si no está seleccionado, lo añadimos
        const newSelection = [...prev, seller];
        if (onSellerChange) onSellerChange(newSelection);
        return newSelection;
      }
    });
  };

  return (
    <div className="filter-section">
      <h3>Vendedores</h3>
      <div className="seller-filter">
        {sellers.map((seller, index) => (
          <label key={index} className="checkbox-label">
            <input 
              type="checkbox" 
              checked={selectedSellers.includes(seller)}
              onChange={() => handleSellerChange(seller)}
            /> 
            {seller}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SellerFilter;