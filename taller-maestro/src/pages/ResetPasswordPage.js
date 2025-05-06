import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ submitted: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Correo electrónico inválido';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulamos envío exitoso (se reemplazará con lógica real al integrar con el backend)
      console.log('Reset password requested for:', formData.email);
      setSubmitStatus({
        submitted: true,
        message: `Hemos enviado un correo electrónico a ${formData.email} con instrucciones para restablecer tu contraseña.`
      });
      // Aquí se implementará la lógica de solicitud de restablecimiento con el backend
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Recuperar Contraseña</h1>
            <p>Te enviaremos un enlace para restablecer tu contraseña</p>
          </div>
          
          {!submitStatus.submitted ? (
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
              
              <button type="submit" className="auth-button">
                Enviar Instrucciones
              </button>
            </form>
          ) : (
            <div className="success-message">
              <p>{submitStatus.message}</p>
              <button 
                onClick={() => setSubmitStatus({ submitted: false, message: '' })} 
                className="auth-button"
                style={{ marginTop: '20px' }}
              >
                Probar con otro correo
              </button>
            </div>
          )}
          
          <div className="auth-footer">
            <p>¿Recordaste tu contraseña?</p>
            <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;