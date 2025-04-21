import React, { useState } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeValue, setRangeValue] = useState(1000);

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
    <div className="price-range">
      <div className="range-input">
        <input 
          type="range" 
          min="0" 
          max="2000" 
          value={rangeValue} 
          onChange={handleRangeChange} 
          className="range-slider" 
          aria-label="Filtro de precio máximo"
        />
      </div>
      <div className="price-inputs">
        <input 
          type="number" 
          placeholder="0" 
          value={minPrice} 
          onChange={handleMinPriceChange} 
          className="min-price"
          aria-label="Precio mínimo" 
        />
        <span className="price-separator">-</span>
        <input 
          type="number" 
          placeholder="1000" 
          value={maxPrice} 
          onChange={handleMaxPriceChange} 
          className="max-price"
          aria-label="Precio máximo" 
        />
      </div>
      <button className="apply-filter" onClick={handleApplyFilter}>Aplicar</button>
    </div>
  );
};

export default PriceFilter;