import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import './ProductDetailPage.css';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { addToFavorites, getFavorites } from '../services/favoritesService';
import { logoutUser } from '../utils/authUtils';
import { getProductDetail } from '../services/productsService';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductDetail(slug);
        if (result.success) {
          setProduct(result.data);
          setSelectedImage(result.data.image);
          setLoading(false);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };
    fetchProduct();
    // Consultar favoritos si hay usuario
    if (user) {
      getFavorites(user, setUser, navigate)
        .then(setFavorites)
        .catch((error) => {
          console.error('Error al cargar favoritos:', error);
          setFavorites([]);
        });
    }
  }, [slug, user, setUser, navigate]);

  useEffect(() => {
    if (!user) return;
    const reloadFavorites = () => {
      getFavorites(user, setUser, navigate)
        .then(setFavorites)
        .catch((error) => {
          console.error('Error al recargar favoritos:', error);
          setFavorites([]);
        });
    };
    window.addEventListener('favorites-updated', reloadFavorites);
    return () => window.removeEventListener('favorites-updated', reloadFavorites);
  }, [user, setUser, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Por favor inicia sesión para agregar productos al carrito.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      const result = await addToCart(product.id, 1, navigate);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Agregado al carrito!',
          text: `${product.name} se agregó correctamente al carrito`,
          timer: 1200,
          showConfirmButton: false
        });
        // Disparar evento para sincronizar otros componentes
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      
      // Mejorar mensajes de error para el usuario
      let userMessage = 'No se pudo agregar al carrito';
      
      if (error.message.includes('400') || error.message.includes('stock') || error.message.toLowerCase().includes('agotado')) {
        userMessage = 'Lo sentimos, este producto está agotado o no hay suficiente stock disponible.';
      } else if (error.message === 'Sesión expirada' || error.message === 'Usuario no autenticado') {
        logoutUser(setUser, navigate);
        return;
      } else if (error.message.includes('500')) {
        userMessage = 'Error del servidor. Por favor intenta más tarde.';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        userMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: userMessage,
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Por favor inicia sesión para agregar productos a favoritos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    try {
      await addToFavorites(product.id, user, setUser, navigate);
      window.dispatchEvent(new Event('favorites-updated'));
      Swal.fire({
        icon: 'success',
        title: '¡Agregado a Favoritos!',
        text: `${product.name} ahora está en tus favoritos`,
        timer: 1200,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      if (error.message === 'Sesión expirada' || error.message === 'Usuario no autenticado') {
        logoutUser(setUser, navigate);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar a favoritos',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const isFavorite = favorites.some(fav => fav.product?.id === product?.id);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <Loader 
          size="large"
          text="Cargando detalles del producto..."
          type="spinner"
        />
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
              disabled={isFavorite}
            >
              <i className="fas fa-heart"></i> {isFavorite ? 'Ya en Favoritos' : 'Agregar a Favoritos'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage; 