import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';
import logo from '../assets/images/logoNormal.png';
import Swal from 'sweetalert2';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import { logoutUser } from '../utils/authUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { 
    cartItems, 
    cartCount, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    loadingCart 
  } = useCart();

  const dropdownRef = useRef();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isUserDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  useEffect(() => {
    const reloadFavorites = () => {
      if (user) {
        setLoadingFavorites(true);
        getFavorites(user, setUser, navigate)
          .then(setFavorites)
          .catch((error) => {
            console.error('Error al cargar favoritos:', error);
            setFavorites([]);
          })
          .finally(() => setLoadingFavorites(false));
      }
    };
    reloadFavorites();
    window.addEventListener('favorites-updated', reloadFavorites);
    return () => window.removeEventListener('favorites-updated', reloadFavorites);
  }, [user, setUser, navigate]);

  const handleLogout = () => {
    logoutUser(setUser, navigate, false);
    setIsUserDropdownOpen(false);
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Entendido'
    });
  };

  const getInitials = (user) => {
    if (!user) return '';
    const first = user.firstName || user.first_name || '';
    const last = user.lastName || user.last_name || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const openFavoritesDrawer = () => {
    setIsUserDropdownOpen(false);
    setShowFavorites(true);
  };
  const closeFavoritesDrawer = () => setShowFavorites(false);

  const handleGoToDetail = (id, slug, isOutOfStock) => {
    if (!isOutOfStock) navigate(`/producto/${slug}`);
  };

  const handleRemoveFavorite = async (id) => {
    if (!user) return;
    try {
      await removeFromFavorites(id, user, setUser, navigate);
      setFavorites(favorites.filter(fav => fav.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El producto fue eliminado de tus favoritos',
        timer: 1000,
        showConfirmButton: false
      });
      // Lanzar evento para actualizar favoritos en otros componentes si es necesario
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      if (error.message === 'Sesión expirada' || error.message === 'Usuario no autenticado') {
        logoutUser(setUser, navigate);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el favorito',
          confirmButtonColor: '#d33'
        });
      }
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const result = await removeFromCart(itemId, navigate);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Producto eliminado del carrito',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto del carrito',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleIncreaseQuantity = async (itemId) => {
    try {
      const result = await increaseQuantity(itemId, navigate);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo incrementar la cantidad',
        confirmButtonColor: '#d33'
      });
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    try {
      const result = await decreaseQuantity(itemId, navigate);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al decrementar cantidad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo decrementar la cantidad',
        confirmButtonColor: '#d33'
      });
    }
  };

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="El Taller del Maestro" />
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            <li><Link to="/contacto">Contáctenos</Link></li>
          </ul>
        </div>

        <div className="navbar-actions">
          <div className="cart-icon">
            <button onClick={() => setIsCartOpen(!isCartOpen)}>
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{cartCount}</span>
            </button>
            {isCartOpen && (
              <div className="cart-dropdown">
                {loadingCart ? (
                  <div className="cart-loading">
                    <i className="fas fa-spinner fa-spin"></i> Cargando...
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="cart-empty">
                    <p>Tu carrito está vacío</p>
                    <Link to="/catalogo" className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                      Ir a comprar
                    </Link>
                  </div>
                ) : (
                  <div className="cart-items">
                    <div className="cart-header">
                      <h4>Mi Carrito ({cartCount} productos)</h4>
                    </div>
                    <div className="cart-list">
                      {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="cart-item-image"
                          />
                          <div className="cart-item-info">
                            <h5 className="cart-item-name">{item.product.name}</h5>
                            <p className="cart-item-price">
                              ${item.product.price.toLocaleString('es-CO')} c/u
                            </p>
                            <div className="cart-item-quantity">
                              <button 
                                onClick={() => handleDecreaseQuantity(item.product.id)}
                                disabled={item.quantity <= 1}
                                className="quantity-btn"
                              >
                                -
                              </button>
                              <span className="quantity">{item.quantity}</span>
                              <button 
                                onClick={() => handleIncreaseQuantity(item.product.id)}
                                className="quantity-btn"
                              >
                                +
                              </button>
                            </div>
                            <p className="cart-item-total">
                              Subtotal: ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                            </p>
                          </div>
                          <button 
                            className="cart-item-remove"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            title="Eliminar del carrito"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="cart-footer">
                      <div className="cart-total">
                        <strong>Total: ${cartTotal.toLocaleString('es-CO')}</strong>
                      </div>
                      <Link 
                        to="/checkout" 
                        className="btn btn-primary btn-checkout"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Proceder al Pago
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="user-icon">
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              {user ? (
                <span className="user-initials">{getInitials(user)}</span>
              ) : (
                <i className="fas fa-user"></i>
              )}
            </button>
            {isUserDropdownOpen && (
              <>
                <div className="user-dropdown-overlay" style={{zIndex: 9997}}></div>
                <div className="user-dropdown-content" ref={dropdownRef} style={{zIndex: 9999}}>
                  {user ? (
                    <>
                      <div className="user-profile-info">
                        <span
                          className="user-initials-circle"
                          style={{ background: stringToColor(user.email || user.firstName || '') }}
                        >
                          {getInitials(user)}
                        </span>
                        <div className="user-profile-details">
                          <div className="user-profile-name">{user.firstName} {user.lastName}</div>
                          <div className="user-profile-email">{user.email}</div>
                        </div>
                      </div>
                      <ul className="user-dropdown-list">
                        <li>
                          <button className="favorites-link user-dropdown-list-link" type="button" onClick={openFavoritesDrawer}>
                            <i className="fas fa-heart"></i> Mis Favoritos
                          </button>
                        </li>
                        <li>
                          <Link to="/historial-compras" className="user-dropdown-list-link" onClick={()=>setIsUserDropdownOpen(false)}>
                            <i className="fas fa-history"></i> Historial
                          </Link>
                        </li>
                        <li>
                          <Link to="/terms" className="user-dropdown-list-link" onClick={()=>setIsUserDropdownOpen(false)}>
                            <i className="fas fa-file-alt"></i> Términos y Condiciones
                          </Link>
                        </li>
                        <li>
                          <button className="logout-btn user-dropdown-list-link" type="button" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <ul className="user-dropdown-list">
                      <li><Link to="/login" className="user-dropdown-list-link" onClick={()=>setIsUserDropdownOpen(false)}>Iniciar Sesión</Link></li>
                      <li><Link to="/registro" className="user-dropdown-list-link" onClick={()=>setIsUserDropdownOpen(false)}>Registrarse</Link></li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mobile-toggle">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {/*favoritos */}
      {showFavorites && (
        <>
          <div className="favorites-overlay" onClick={closeFavoritesDrawer}></div>
          <div className="favorites-drawer">
            <button className="favorites-close" onClick={closeFavoritesDrawer}>&times;</button>
            <h4>Favoritos</h4>
            {favorites.length === 0 ? (
              <div className="favorites-empty">No tienes favoritos aún.</div>
            ) : (
              <ul className="favorites-list">
                {favorites.map(fav => {
                  const isOut = fav.product && fav.product.stock === 0;
                  return (
                    <li key={fav.id} className={`favorite-item${isOut ? ' favorite-item-out' : ''}`}
                        onClick={() => handleGoToDetail(fav.product?.id, fav.product?.slug, isOut)}
                        style={{cursor: isOut ? 'not-allowed' : 'pointer'}}
                    >
                      <img src={fav.product?.image} alt={fav.product?.name} className="favorite-thumb" />
                      <div className="favorite-info">
                        <div className="favorite-title">{fav.product?.name}</div>
                        <div className="favorite-price">${fav.product?.price?.toLocaleString('es-CO')}</div>
                        <div className={`favorite-stock ${isOut ? 'out' : 'in'}`}>{isOut ? 'Agotado' : `${fav.product?.stock} unidades`}</div>
                      </div>
                      <button className="favorite-remove" onClick={e => {e.stopPropagation(); handleRemoveFavorite(fav.id);}} title="Eliminar">&times;</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;