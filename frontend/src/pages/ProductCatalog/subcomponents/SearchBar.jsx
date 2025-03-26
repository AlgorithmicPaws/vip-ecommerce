import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Buscar productos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder={placeholder} 
          value={searchTerm}
          onChange={handleInputChange}
          aria-label="Buscar"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;