import React, { createContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/authUtils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar si el usuario almacenado tiene tokens válidos al inicializar
    if (user && user.token) {
      const refreshToken = localStorage.getItem('refreshToken') || user.refreshToken;
      
      // Si tanto access como refresh token han expirado, hacer logout silencioso
      if (isTokenExpired(user.token) && (!refreshToken || isTokenExpired(refreshToken))) {
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isInitialized 
    }}>
      {children}
    </UserContext.Provider>
  );
}; 