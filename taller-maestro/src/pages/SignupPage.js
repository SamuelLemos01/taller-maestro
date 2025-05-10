import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AuthPages.css';
import Swal from 'sweetalert2';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.firstName.trim()) tempErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) tempErrors.lastName = 'El apellido es obligatorio';

    if (!formData.phone.trim()){
      tempErrors.phone = 'El numero de teléfono de usuario es obligatorio';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'El numero de teléfono debe tener 10 dígitos';
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Correo electrónico inválido';
    }
    
    if (!formData.password) {
      tempErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.agreeTerms) {
      tempErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/api/auth/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al registrar usuario');
        }

        // Registro exitoso: redirige al login con estado
        navigate('/login', { state: { registered: true } });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al registrar usuario',
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
            <h1>Crear Cuenta</h1>
            <p>Únete a nuestra comunidad y comienza tu experiencia</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Tu numero de teléfono"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

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
                placeholder="Crea una contraseña segura"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreeTerms">
                  Acepto los <Link to="/terms" className="auth-link">Términos y Condiciones</Link>
                </label>
              </div>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={!formData.agreeTerms}
              style={{ opacity: formData.agreeTerms ? 1 : 0.5, cursor: formData.agreeTerms ? 'pointer' : 'not-allowed' }}
            >
              Registrarme
            </button>
          </form>
          
          <div className="auth-footer">
            <p>¿Ya tienes una cuenta?</p>
            <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage; 