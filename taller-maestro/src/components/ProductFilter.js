import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ categories, selectedCategories = [], onCategoryChange }) => {
  const [priceRange, setPriceRange] = useState([10000, 250000]);
  const [sortBy, setSortBy] = useState('');

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const handleCategoryChange = (categorySlug) => {
    let newCategories;
    if (selectedCategories.includes(categorySlug)) {
      newCategories = selectedCategories.filter(cat => cat !== categorySlug);
    } else {
      newCategories = [...selectedCategories, categorySlug];
    }
    onCategoryChange(newCategories);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onCategoryChange(selectedCategories, priceRange, e.target.value);
  };

  const applyFilters = () => {
    onCategoryChange(selectedCategories, priceRange, sortBy);
  };

  const clearFilters = () => {
    setPriceRange([10000, 250000]);
    setSortBy('');
    onCategoryChange([], [10000, 250000], '');
  };

  return (
    <div className="product-filter">
      <h3 className="filter-title">Filtros</h3>
      
      <div className="filter-section">
        <h4 className="filter-subtitle">Categorías</h4>
        <div className="category-list">
          {categories.map(category => (
            <label key={category.id} className="category-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => handleCategoryChange(category.slug)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-subtitle">Rango de Precios</h4>
        <div className="price-inputs">
          <div className="price-input">
            <label>Mín:</label>
            <input 
              type="number" 
              min="10000" 
              max={priceRange[1]} 
              value={priceRange[0]} 
              onChange={(e) => handlePriceChange(e, 'min')}
            />
          </div>
          <div className="price-input">
            <label>Máx:</label>
            <input 
              type="number" 
              min={priceRange[0]} 
              max="250000" 
              value={priceRange[1]} 
              onChange={(e) => handlePriceChange(e, 'max')}
            />
          </div>
        </div>
        <div className="price-slider">
          <input 
            type="range" 
            min="10000" 
            max="250000" 
            value={priceRange[0]} 
            onChange={(e) => handlePriceChange(e, 'min')}
            className="range-min"
          />
          <input 
            type="range" 
            min="10000" 
            max="250000" 
            value={priceRange[1]} 
            onChange={(e) => handlePriceChange(e, 'max')}
            className="range-max"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-subtitle">Ordenar por</h4>
        <select 
          value={sortBy} 
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="">Seleccionar...</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="name_asc">Nombre: A-Z</option>
          <option value="name_desc">Nombre: Z-A</option>
          <option value="newest">Más Recientes</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary uno" style={{fontSize: '.8rem'}} onClick={applyFilters}>
          Aplicar Filtros
        </button>
        <button className="btn btn-primary dos" style={{fontSize: '.8rem'}} onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default ProductFilter; 