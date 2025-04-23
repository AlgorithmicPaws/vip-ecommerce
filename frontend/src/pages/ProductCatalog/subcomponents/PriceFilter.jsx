import React, { useState, useEffect } from 'react';

const PriceFilter = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeValue, setRangeValue] = useState(2000);
  const [error, setError] = useState('');

  // Reset error when inputs change
  useEffect(() => {
    setError('');
  }, [minPrice, maxPrice]);

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
    <div className="filter-section">
      <h3>Filtrar por Precio</h3>
      <div className="price-range">
        <div className="range-input">
          <input 
            type="range" 
            min="5000" 
            max="100000000" 
            value={rangeValue} 
            onChange={handleRangeChange} 
            className="range-slider" 
          />
        </div>
        <div className="price-inputs">
          <div className="input-group">
            <label>Mín.</label>
            <input 
              type="text" 
              placeholder="0" 
              value={minPrice} 
              onChange={handleMinPriceChange} 
              className="min-price" 
            />
          </div>
          <span className="price-separator">-</span>
          <div className="input-group">
            <label>Máx.</label>
            <input 
              type="text" 
              placeholder="Máx" 
              value={maxPrice} 
              onChange={handleMaxPriceChange} 
              className="max-price" 
            />
          </div>
        </div>
        
        {error && <div className="price-error">{error}</div>}
        
        <div className="price-buttons">
          <button className="apply-filter" onClick={handleApplyFilter}>Aplicar</button>
          <button className="clear-filter" onClick={handleClearFilter}>Limpiar</button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;