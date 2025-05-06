import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductFilter from '../components/ProductFilter';
import ProductSearch from '../components/ProductSearch';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

const API_URL = 'http://localhost:8000/api/v1/products';

const CatalogPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentCategories = searchParams.getAll('categories[]') || [];
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('min_price') || '10000';
  const currentMaxPrice = searchParams.get('max_price') || '250000';
  const currentSortBy = searchParams.get('sort_by') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/`);
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_URL}/catalog/?`;
        
        currentCategories.forEach(category => {
          url += `categories[]=${category}&`;
        });
        
        if (currentSearch) url += `search=${currentSearch}&`;
        if (currentMinPrice) url += `min_price=${currentMinPrice}&`;
        if (currentMaxPrice) url += `max_price=${currentMaxPrice}&`;
        if (currentSortBy) url += `sort_by=${currentSortBy}&`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategories, currentSearch, currentMinPrice, currentMaxPrice, currentSortBy]);

  const handleSearch = (searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleFilters = (categories, priceRange, sortBy) => {
    const params = new URLSearchParams(searchParams);
    
    // Limpiar categorías anteriores
    params.delete('categories[]');
    // Agregar nuevas categorías
    categories.forEach(category => {
      params.append('categories[]', category);
    });
    
    if (priceRange) {
      params.set('min_price', priceRange[0]);
      params.set('max_price', priceRange[1]);
    }
    
    if (sortBy) {
      params.set('sort_by', sortBy);
    } else {
      params.delete('sort_by');
    }
    
    setSearchParams(params);
  };

  const handleProductClick = (product) => {
    navigate(`/producto/${product.slug}`);
  };

  if (loading) {
    return (
      <div className="catalog-page">
        <Navbar />
        <div className="loading">Cargando productos...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-page">
        <Navbar />
        <div className="error">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <Navbar />

      <div className="catalog-container container">
        <h1 className="catalog-title">Catálogo de Productos</h1>

        <ProductSearch 
          initialValue={currentSearch}
          onSearch={handleSearch} 
        />

        <div className="catalog-content">
          <aside className="catalog-sidebar">
            <ProductFilter 
              categories={categories}
              selectedCategories={currentCategories}
              onCategoryChange={handleFilters}
            />
          </aside>

          <main className="catalog-products">
            {products.length === 0 ? (
              <div className="no-products-message">
                <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                <p>Intenta con otros términos o ajusta los filtros.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} onClick={() => handleProductClick(product)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CatalogPage; 