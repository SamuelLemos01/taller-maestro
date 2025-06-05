import axios from 'axios';
import { checkAndRefreshToken } from '../utils/authUtils';

const API_URL = 'http://localhost:8000/api/v1/products';

// Función auxiliar para hacer peticiones autenticadas
const makeAuthenticatedRequest = async (requestFunction, user, setUser, navigate) => {
  if (!user || !user.token) {
    throw new Error('Usuario no autenticado');
  }

  // Verificar y renovar token si es necesario
  const isValid = await checkAndRefreshToken(user, setUser, navigate);
  if (!isValid) {
    throw new Error('Sesión expirada');
  }

  // Obtener el token actualizado
  const currentUser = JSON.parse(localStorage.getItem('user'));
  return await requestFunction(currentUser.token);
};

export const getFavorites = async (user, setUser, navigate) => {
  return makeAuthenticatedRequest(
    async (token) => {
      const response = await axios.get(`${API_URL}/favorites/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    },
    user, setUser, navigate
  );
};

export const addToFavorites = async (productId, user, setUser, navigate) => {
  return makeAuthenticatedRequest(
    async (token) => {
      const response = await axios.post(
        `${API_URL}/favorites/`,
        { product_id: productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    user, setUser, navigate
  );
};

export const removeFromFavorites = async (favoriteId, user, setUser, navigate) => {
  return makeAuthenticatedRequest(
    async (token) => {
      const response = await axios.delete(`${API_URL}/favorites/${favoriteId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    },
    user, setUser, navigate
  );
};
