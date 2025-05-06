import React from 'react';
import './FeatureCards.css';

const FeatureCards = () => {
  const features = [
    {
      icon: 'fas fa-truck',
      title: 'Envío Gratis',
      description: 'En pedidos superiores a $50'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Garantía de Calidad',
      description: 'Satisfacción garantizada'
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Devoluciones',
      description: 'Hasta 30 días después de la compra'
    },
    {
      icon: 'fas fa-headset',
      title: 'Soporte 24/7',
      description: 'Asistencia cuando la necesites'
    }
  ];

  return (
    <div className="feature-cards">
      <div className="container">
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards; 