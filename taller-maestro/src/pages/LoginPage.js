import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AuthPages.css';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../services/authService';

const LoginPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (location.state && location.state.registered) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Por favor inicia sesión ahora.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    }
    if (location.state && location.state.loggedOut) {
      Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Correo electrónico inválido';
    }
    
    if (!formData.password) {
      tempErrors.password = 'La contraseña es obligatoria';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Usar el servicio de autenticación
        const result = await loginUser(formData.email, formData.password);
        
        if (result.success) {
          // Login exitoso
          const data = result.data;
          
          // Guardar el refresh token por separado
          localStorage.setItem('refreshToken', data.refresh);
          
          setUser({
            email: formData.email,
            token: data.access,
            refreshToken: data.refresh,
            firstName: data.first_name || data.firstName,
            lastName: data.last_name || data.lastName
          });
          
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Continuar'
          }).then(() => {
            navigate('/');
          });
        } else {
          // Error en el login
          throw new Error(result.error);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al iniciar sesión',
          confirmButtonColor: '#d33'
        });
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Iniciar Sesión</h1>
            <p>Bienvenido de vuelta a Taller Maestro</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre@ejemplo.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Recordarme</label>
              </div>
              <div className="forgot-password">
                <Link to="/reset-password" className="auth-link">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
            
            <button type="submit" className="auth-button">
              Iniciar Sesión
            </button>
          </form>
          
          <div className="auth-footer">
            <p>¿No tienes una cuenta?</p>
            <Link to="/registro" className="auth-link">Regístrate aquí</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage; 