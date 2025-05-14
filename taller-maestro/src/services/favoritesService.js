import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/products';

export const getFavorites = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/favorites/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    throw error;
  }
};

export const addToFavorites = async (productId, token) => {
  try {
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
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    throw error;
  }
};

export const removeFromFavorites = async (favoriteId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${favoriteId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};
