import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import FeatureCards from '../components/FeatureCards';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';
import './HomePage.css';

const API_URL = 'http://localhost:8000/api/v1/products';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch(`${API_URL}/featured/`),
          fetch(`${API_URL}/new/`)
        ]);

        if (!featuredRes.ok || !newRes.ok) {
          throw new Error('Error al cargar los productos');
        }

        const [featured, newProds] = await Promise.all([
          featuredRes.json(),
          newRes.json()
        ]);

        setFeaturedProducts(featured);
        setNewProducts(newProds);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar />
      <HeroSlider />
      <FeatureCards />
      {featuredProducts.length > 0 && (
        <ProductsSection title="Productos Destacados" products={featuredProducts} />
      )}
      {newProducts.length > 0 && (
        <ProductsSection title="Nuevos Productos" products={newProducts} />
      )}
      <Footer />
    </div>
  );
};

export default HomePage; 