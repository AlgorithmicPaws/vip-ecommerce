import React, { useState, useEffect } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeValue, setRangeValue] = useState(1000);

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setRangeValue(value);
    setMaxPrice(value.toString());
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    
    // Only allow positive numbers or empty string
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    
    // Only allow positive numbers or empty string
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setMaxPrice(value);
      if (value !== '') {
        setRangeValue(parseInt(value));
      }
    }
  };

  const handleApplyFilter = () => {
    // Convert to numbers for comparison
    const min = minPrice === '' ? 0 : parseInt(minPrice);
    const max = maxPrice === '' ? 0 : parseInt(maxPrice);
    
    // Validate min and max values
    if (min > max && max !== 0) {
      setError('El precio mínimo no puede ser mayor que el máximo');
      return;
    }
    
    if (onPriceChange) {
      onPriceChange(min || '', max || '');
    }
  };

  const handleClearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setRangeValue(2000);
    setError('');
    
    if (onPriceChange) {
      onPriceChange('', '');
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