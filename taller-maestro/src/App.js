import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import AuthLoader from './components/AuthLoader';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Importar componentes
import Navbar from './components/Navbar';
import WhatsAppFloat from './components/WhatsAppFloat';
// Importar páginas
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AuthLoader>
            <div className="app">
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalogo" element={<CatalogPage />} />
                  <Route path="/quienes-somos" element={<AboutUsPage />} />
                  <Route path="/contacto" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/registro" element={<SignupPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/producto/:slug" element={<ProductDetailPage />} />
                </Routes>
              </main>
              <WhatsAppFloat />
            </div>
          </AuthLoader>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App; 