import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import FeatureCards from '../components/FeatureCards';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import './HomePage.css';
import { getHomepageData } from '../services/productsService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Usar el servicio de productos
        const result = await getHomepageData();
        
        if (result.success) {
          setFeaturedProducts(result.data.featured);
          setNewProducts(result.data.new);
        } else {
          throw new Error(result.error);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Error al cargar los productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <Loader 
          size="large"
          text="Cargando productos destacados..."
          type="spinner"
        />
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