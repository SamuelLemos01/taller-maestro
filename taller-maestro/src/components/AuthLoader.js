import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './AuthLoader.css';

const AuthLoader = ({ children }) => {
  const { isInitialized } = useContext(UserContext);

  // Mostrar un loader mientras se inicializa el contexto
  if (!isInitialized) {
    return (
      <div className="auth-loader-container">
        <div className="auth-loader-content">
          <div className="auth-loader-spinner"></div>
          <p className="auth-loader-text">Cargando...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthLoader; 