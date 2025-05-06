import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-title">El Taller del Maestro</h3>
            <p>
              Somos una tienda especializada en productos artesanales de alta calidad. 
              Nuestra misión es ofrecer los mejores productos con materiales duraderos 
              y diseños únicos.
            </p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          <div className="footer-section links">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
              <li><Link to="/contactenos">Contáctenos</Link></li>
              <li><Link to="/politicas-de-envio">Políticas de Envío</Link></li>
              <li><Link to="/terminos-y-condiciones">Términos y Condiciones</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3 className="footer-title">Contacto</h3>
            <p><i className="fas fa-map-marker-alt"></i> Calle Principal #123, Ciudad</p>
            <p><i className="fas fa-phone"></i> +1 (123) 456-7890</p>
            <p><i className="fas fa-envelope"></i> info@tallerdelmaestro.com</p>
            <p><i className="fas fa-clock"></i> Lunes a Viernes: 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} El Taller del Maestro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 