import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const AUTH_URL = `${API_BASE_URL}/auth`;
const TOKEN_URL = `${API_BASE_URL}/token`;

// Función para login del usuario
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${TOKEN_URL}/`, {
            email: email,
            password: password
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || error.response?.data?.error || 'Error al iniciar sesión'
        };
    }
};

// Función para registro del usuario
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${AUTH_URL}/signup/`, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            email: userData.email,
            password: userData.password
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Error al registrar usuario'
        };
    }
};

// Función para renovar token
export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${TOKEN_URL}/refresh/`, {
            refresh: refreshToken
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error al renovar token'
        };
    }
};

// Función para solicitar reset de contraseña (futura implementación)
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${AUTH_URL}/reset-password/`, {
            email: email
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || 'Error al solicitar reset de contraseña'
        };
    }
};

// Función para validar token (sin hacer petición, solo verificar expiración)
export const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > (currentTime + 60); // Margen de 60 segundos
    } catch (error) {
        return false;
    }
}; 