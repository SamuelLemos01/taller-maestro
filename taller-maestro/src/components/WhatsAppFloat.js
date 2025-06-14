import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
    return (
        <div className="whatsapp-float">
            <a 
                href="https://wa.me/573002920612?text=Hola,%20estoy%20interesado%20en%20sus%20productos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="icon" />
            </a>
        </div>
    );
};

export default WhatsAppFloat;