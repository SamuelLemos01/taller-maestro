import React from 'react';
import ProductCard from './ProductCard';
import './ProductsSection.css';

const ProductsSection = ({ title, products }) => {
  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="view-all-container">
          <button className="btn btn-secondary">Ver Todos los Productos</button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection; 