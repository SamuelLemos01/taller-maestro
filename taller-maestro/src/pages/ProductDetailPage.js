import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetailPage.css';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';

const API_URL = 'http://localhost:8000/api/v1/products';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

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
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Por favor inicia sesión para agregar productos al carrito.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `${product.name} se agregó correctamente al carrito`,
      timer: 1200,
      showConfirmButton: false
    });
  };

  const handleAddToFavorites = () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Por favor inicia sesión para agregar productos a favoritos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.find(f => f.id === product.id)) {
      favs.push(product);
      localStorage.setItem('favorites', JSON.stringify(favs));
      Swal.fire({
        icon: 'success',
        title: '¡Agregado a Favoritos!',
        text: `${product.name} ahora está en tus favoritos`,
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Ya está en Favoritos',
        timer: 1000,
        showConfirmButton: false
      });
    }
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

          <div className="product-meta" style={{marginTop: '0.5rem', paddingTop: 0, borderTop: 'none'}}>
            <div className="stock-info">
              <span className="label">Stock:</span>
              <span className={`value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
              </span>
            </div>
          </div>

          <div className="product-actions product-actions-fullwidth">
            <button 
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{transition: 'transform 0.1s'}}
            >
              <i className="fas fa-cart-plus"></i> {product.stock > 0 ? 'Agregar al carrito' : 'Sin Stock'}
            </button>
            <button 
              className="btn-add-favorite"
              onClick={handleAddToFavorites}
              style={{transition: 'transform 0.1s'}}
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