import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <Navbar />
      
      <div className="about-hero">
        <div className="container">
          <h1>Quiénes Somos</h1>
          <p>Conoce la historia detrás de El Taller del Maestro</p>
        </div>
      </div>
      
      <div className="container">
        <div className="about-content">
          <section className="about-section">
            <h2>Nuestra Historia</h2>
            <div className="about-grid">
              <div className="about-text">
                <p>
                  El Taller del Maestro nació en 2015 como un pequeño proyecto familiar dedicado a la creación de muebles y objetos decorativos artesanales. Lo que comenzó como un hobbie en un pequeño taller, se ha convertido hoy en un referente de la artesanía de calidad.
                </p>
                <p>
                  Fundado por Carlos Martínez, un ebanista con más de 30 años de experiencia, nuestra empresa ha crecido manteniendo siempre el espíritu artesanal y el compromiso con la calidad que nos caracteriza desde el primer día.
                </p>
                <p>
                  A lo largo de estos años, hemos colaborado con diseñadores locales, participado en ferias internacionales y desarrollado una comunidad de clientes fieles que valoran el trabajo hecho a mano y la atención al detalle.
                </p>
              </div>
              <div className="about-image">
                <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" alt="Nuestro taller" />
              </div>
            </div>
          </section>
          
          <section className="about-section values-section">
            <h2>Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <h3>Artesanía</h3>
                <p>Creemos en el valor del trabajo hecho a mano, con dedicación y cuidado en cada detalle.</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3>Sostenibilidad</h3>
                <p>Utilizamos materiales sostenibles y procesos respetuosos con el medio ambiente.</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Comunidad</h3>
                <p>Apoyamos a artesanos locales y creamos relaciones duraderas con nuestros clientes.</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3>Calidad</h3>
                <p>Nos comprometemos a ofrecer productos duraderos que superen las expectativas.</p>
              </div>
            </div>
          </section>
          
          <section className="about-section mission-vision">
            <div className="mission-vision-container">
              <div className="mission-box">
                <h2>Nuestra Misión</h2>
                <p>
                  Nuestra misión es crear productos artesanales de la más alta calidad que combinen tradición e innovación, utilizando técnicas ancestrales y materiales sostenibles para ofrecer piezas únicas que enriquezcan los espacios y la vida de nuestros clientes.
                </p>
                <p>
                  Nos esforzamos por preservar el arte de la ebanistería y otras técnicas artesanales, adaptándolas a las necesidades y gustos contemporáneos, sin perder la esencia del trabajo hecho a mano.
                </p>
              </div>
              
              <div className="vision-box">
                <h2>Nuestra Visión</h2>
                <p>
                  Aspiramos a ser reconocidos como líderes en la creación de productos artesanales de alta gama, posicionándonos como un referente de excelencia y sostenibilidad en el sector.
                </p>
                <p>
                  Buscamos expandir nuestra presencia a nivel internacional, manteniendo siempre nuestros valores artesanales y el compromiso con la calidad, mientras fomentamos el aprecio por lo hecho a mano y contribuimos a la preservación de técnicas tradicionales.
                </p>
              </div>
            </div>
          </section>
          
          <section className="about-section team-section">
            <h2>Nuestro Equipo</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Carlos Martínez" />
                </div>
                <h3>Carlos Martínez</h3>
                <p className="member-role">Fundador y Maestro Artesano</p>
              </div>
              
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Ana López" />
                </div>
                <h3>Ana López</h3>
                <p className="member-role">Directora Creativa</p>
              </div>
              
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Miguel Sánchez" />
                </div>
                <h3>Miguel Sánchez</h3>
                <p className="member-role">Jefe de Producción</p>
              </div>
              
              <div className="team-member">
                <div className="member-image">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Laura Gómez" />
                </div>
                <h3>Laura Gómez</h3>
                <p className="member-role">Responsable de Atención al Cliente</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUsPage; 