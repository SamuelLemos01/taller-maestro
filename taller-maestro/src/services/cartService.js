import axios from 'axios';
import { checkAndRefreshToken } from '../utils/authUtils';

const API_URL = 'http://localhost:8000/api/v1/shopping-cart';

// Función auxiliar para hacer peticiones autenticadas
const makeAuthenticatedRequest = async (requestFunction, user, setUser, navigate) => {
    try {
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
        const response = await requestFunction(currentUser.token);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error en makeAuthenticatedRequest:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Error desconocido' 
        };
    }
};

export const getCart = async (user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.get(`${API_URL}/cart/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        },
        user, setUser, navigate
    );
};

export const addToCart = async (productId, quantity, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.post(
                `${API_URL}/cart/add/`,
                {
                    product_id: productId,
                    quantity: quantity
                },
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

export const increaseQuantity = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.post(
                `${API_URL}/cart/increase/`, 
                { product_id: itemId }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            return response.data;
        },
        user, setUser, navigate
    );
};

export const decreaseQuantity = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.post(
                `${API_URL}/cart/decrease/`, 
                { product_id: itemId }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            return response.data;
        },
        user, setUser, navigate
    );
};

export const updateCartItem = async (itemId, quantity, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.put(
                `${API_URL}/cart/${itemId}/`,
                { quantity: quantity },
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

export const removeFromCart = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.post(
                `${API_URL}/cart/remove/`, 
                { product_id: itemId }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        },
        user, setUser, navigate
    );
};

export const clearCart = async (user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.delete(`${API_URL}/cart/clear/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        },
        user, setUser, navigate
    );
};

// ALTERNATIVAS - Si las de arriba no funcionan, puedes probar estas:

// OPCIÓN 1: Sin /cart/ en la URL
export const increaseQuantityAlt1 = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.post(`${API_URL}/${itemId}/increase/`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        },
        user, setUser, navigate
    );
};

// OPCIÓN 2: Con PATCH en lugar de POST
export const increaseQuantityAlt2 = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            const response = await axios.patch(`${API_URL}/${itemId}/`, { action: 'increase' }, { headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        },
        user, setUser, navigate
    );
};

// OPCIÓN 3: Con PUT update quantity
export const increaseQuantityAlt3 = async (itemId, user, setUser, navigate) => {
    return makeAuthenticatedRequest(
        async (token) => {
            // Primero necesitaríamos obtener la cantidad actual y sumarle 1
            const response = await axios.put(`${API_URL}/${itemId}/`, { quantity_increment: 1 }, { headers: { 'Authorization': `Bearer ${token}` } });
            return response.data;
        },
        user, setUser, navigate
    );
};
