import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
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
    
    if (!formData.name.trim()) {
      tempErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Correo electrónico inválido';
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = 'El mensaje es obligatorio';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulación de envío exitoso
      console.log('Form submitted:', formData);
      setSubmitStatus({
        submitted: true,
        message: `Gracias ${formData.name} por tu mensaje. Te contactaremos pronto.`
      });
      // Aquí se implementará la lógica de envío de formulario al backend
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-hero">
        <div className="container">
          <h1>Contáctenos</h1>
          <p>Estamos aquí para ayudarte. ¡Comunícate con nosotros!</p>
        </div>
      </div>
      
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            <p>Puedes comunicarte con nosotros a través de cualquiera de los siguientes medios, o utilizar el formulario de contacto.</p>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-text">
                <h3>Dirección</h3>
                <p>Calle Principal #123, Ciudad, País</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="info-text">
                <h3>Teléfono</h3>
                <p>+1 (123) 456-7890</p>
                <p>+1 (123) 456-7891</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-text">
                <h3>Correo Electrónico</h3>
                <p>info@tallerdelmaestro.com</p>
                <p>ventas@tallerdelmaestro.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-text">
                <h3>Horario de Atención</h3>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 3:00 PM</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
            
            <div className="social-media">
              <h3>Síguenos en Redes Sociales</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-pinterest"></i></a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h2>Envíanos un Mensaje</h2>
            
            {!submitStatus.submitted ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Asunto de tu mensaje"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí"
                    rows="5"
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                
                <button type="submit" className="btn-primary">
                  Enviar Mensaje
                </button>
              </form>
            ) : (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>¡Mensaje Enviado!</h3>
                <p>{submitStatus.message}</p>
                <button 
                  onClick={() => {
                    setSubmitStatus({ submitted: false, message: '' });
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: '',
                      message: ''
                    });
                  }} 
                  className="btn-primary"
                >
                  Enviar Otro Mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5354123118713!2d-79.90042758459473!3d-2.170487037793051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902d6dbde24db8f9%3A0x50313f7a90a720f0!2sMal%C3%A9con%202000!5e0!3m2!1ses!2sec!4v1622134386543!5m2!1ses!2sec" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          title="Ubicación"
        ></iframe>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage; 