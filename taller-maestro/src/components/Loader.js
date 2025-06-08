import React from 'react';
import './Loader.css';

const Loader = ({
    size = 'medium',
    text = 'Cargando...',
    type = 'spinner',
    fullScreen = false
}) => {
    const sizeClasses = {
        small: 'loader-small',
        medium: 'loader-medium',
        large: 'loader-large'
    };

    const loaderContent = (
        <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
            <div className={`loader ${type} ${sizeClasses[size]}`}>
                <div className="loader-spinner">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>
            </div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );

    return loaderContent;
};

export default Loader; 