import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const API_BASE_URL = 'http://localhost:8000';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/producto/${product.slug}`);
    };

    const imageUrl = product.image.startsWith('http') 
        ? product.image 
        : `${API_BASE_URL}${product.image}`;

    return (
        <div className="product-card" onClick={handleClick}>
            <div className="product-image-container">
                <img src={imageUrl} alt={product.name} className="product-image" />
                {product.is_new && (
                    <span className="badge new">Nuevo</span>
                )}
                {product.is_featured && (
                    <span className="badge featured">Destacado</span>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">${product.price.toLocaleString('es-CO')}</span>
                    <button 
                        className={`product-button ${product.stock === 0 ? 'disabled' : ''}`}
                        disabled={product.stock === 0}
                    >
                        {product.stock > 0 ? 'Agregar' : 'Sin stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;