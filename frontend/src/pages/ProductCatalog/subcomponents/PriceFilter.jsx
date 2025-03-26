import React, { useState } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeValue, setRangeValue] = useState(2000);

  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
    setMaxPrice(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setRangeValue(e.target.value);
  };

  const handleApplyFilter = () => {
    if (onPriceChange) {
      onPriceChange(Number(minPrice), Number(maxPrice));
    }
  };

  return (
    <div className="filter-section">
      <h3>Filtrar por Precio</h3>
      <div className="price-range">
        <div className="range-input">
          <input 
            type="range" 
            min="0" 
            max="2000" 
            value={rangeValue} 
            onChange={handleRangeChange} 
            className="range-slider" 
          />
        </div>
        <div className="price-inputs">
          <input 
            type="number" 
            placeholder="Mín" 
            value={minPrice} 
            onChange={handleMinPriceChange} 
            className="min-price" 
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Máx" 
            value={maxPrice} 
            onChange={handleMaxPriceChange} 
            className="max-price" 
          />
        </div>
        <button className="apply-filter" onClick={handleApplyFilter}>Aplicar</button>
      </div>
    </div>
  );
};

export default PriceFilter;