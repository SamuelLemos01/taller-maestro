import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetailPage.css';

const API_URL = 'http://localhost:8000/api/v1/products';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/detail/${slug}/`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    // TODO: Implementar lógica del carrito
    console.log('Agregar al carrito:', product);
  };

  const handleAddToFavorites = () => {
    // TODO: Implementar lógica de favoritos
    console.log('Agregar a favoritos:', product);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="loading">Cargando producto...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="error">{error || 'Producto no encontrado'}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />
      
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            <img 
              src={product.image} 
              alt={product.name}
              className={selectedImage === product.image ? 'active' : ''}
              onClick={() => setSelectedImage(product.image)}
            />
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt={`${product.name} - vista adicional`}
                className={selectedImage === img.image ? 'active' : ''}
                onClick={() => setSelectedImage(img.image)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            {product.category && (
              <span className="product-category">{product.category.name}</span>
            )}
          </div>

          <div className="product-badges">
            {product.is_new && <span className="badge new">Nuevo</span>}
            {product.is_featured && <span className="badge featured">Destacado</span>}
          </div>

          <div className="product-price">
            ${product.price.toLocaleString('es-CO')}
          </div>

          <div className="product-description">
            <h2>Descripción</h2>
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div className="stock-info">
              <span className="label">Stock:</span>
              <span className={`value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
              </span>
            </div>
          </div>

          <div className="product-actions">
            <button 
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Mirar más' : 'Sin Stock'}
            </button>
            <button 
              className="btn-add-favorite"
              onClick={handleAddToFavorites}
            >
              <i className="fas fa-heart"></i> Agregar a Favoritos
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage; 