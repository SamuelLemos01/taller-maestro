import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logoNormal.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
              <span className="cart-count">0</span>
            </button>
            {isCartOpen && (
              <div className="cart-dropdown">
                <div className="cart-empty">
                  <p>Tu carrito está vacío</p>
                  <Link to="/catalogo" className="btn btn-primary">Ir a comprar</Link>
                </div>
              </div>
            )}
          </div>

          <div className="user-icon">
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <i className="fas fa-user"></i>
            </button>
            {isUserDropdownOpen && (
              <div className="user-dropdown">
                <ul>
                  <li><Link to="/login">Iniciar Sesión</Link></li>
                  <li><Link to="/registro">Registrarse</Link></li>
                  <li><Link to="/mi-cuenta">Mi Cuenta</Link></li>
                  <li><Link to="/historial-compras">Historial de Compras</Link></li>
                  <li><Link to="/politicas">Políticas</Link></li>
                  <li><Link to="/logout">Cerrar Sesión</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mobile-toggle">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;