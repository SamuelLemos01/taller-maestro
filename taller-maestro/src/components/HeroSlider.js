import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';
import pinturas from '../assets/images/pinturas.jpeg';
import oferta from '../assets/images/oferta.jpeg';

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      category: 'Cajas',
      title: 'Cajas de',
      subtitle: 'Madera',
      buttonText: 'Descubrir',
      link: '/catalogo',
      image: pinturas
    },
    {
      id: 2,
      category: 'Cajas',
      title: 'Cajas de',
      subtitle: 'Madera',
      buttonText: 'Descubrir',
      link: '/catalogo',
      image: pinturas
    }
  ];

  const changeSlide = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setPrevSlide(activeSlide);
    setActiveSlide(newIndex);

    setTimeout(() => {
      setPrevSlide(null);
      setIsTransitioning(false);
    }, 600); // Coincide con la duración de la transición en CSS
  };

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide((activeSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleDotClick = (index) => {
    if (index === activeSlide) return;
    changeSlide(index);
  };

  return (
    <section className="hero-slider">
      <div className="hero-container">
        <div className="slide-content-wrapper">
          <div className="slide-content">
            <p className="slide-category">{slides[activeSlide].category}</p>
            <h1 className="slide-title">
              {slides[activeSlide].title}
              <span className="slide-subtitle">{slides[activeSlide].subtitle}</span>
            </h1>
            <Link to={slides[activeSlide].link} className="slide-button">
              {slides[activeSlide].buttonText}
            </Link>
          </div>
          
          <div className="slide-image">
            {/* Imagen activa */}
            <img 
              src={slides[activeSlide].image} 
              alt={slides[activeSlide].title} 
              className={`image-placeholder active`}
              key={`active-${activeSlide}`}
            />
            {/* Imagen anterior durante la transición */}
            {prevSlide !== null && (
              <img 
                src={slides[prevSlide].image} 
                alt={slides[prevSlide].title} 
                className="image-placeholder exit"
                key={`prev-${prevSlide}`}
              />
            )}
          </div>
        </div>
        
        <div className="slider-navigation">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider; 