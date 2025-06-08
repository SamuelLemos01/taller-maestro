import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/products';

// Función para obtener todos los productos del catálogo con filtros
export const getProducts = async (filters = {}) => {
    try {
        let url = `${API_URL}/catalog/?`;

        // Agregar filtros a la URL
        if (filters.categories && filters.categories.length > 0) {
            filters.categories.forEach(category => {
                url += `categories[]=${category}&`;
            });
        }

        if (filters.search) url += `search=${filters.search}&`;
        if (filters.minPrice) url += `min_price=${filters.minPrice}&`;
        if (filters.maxPrice) url += `max_price=${filters.maxPrice}&`;
        if (filters.sortBy) url += `sort_by=${filters.sortBy}&`;

        const response = await axios.get(url);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error al cargar productos'
        };
    }
};

// Función para obtener productos destacados
export const getFeaturedProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/featured/`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error al cargar productos destacados'
        };
    }
};

// Función para obtener productos nuevos
export const getNewProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/new/`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error al cargar productos nuevos'
        };
    }
};

// Función para obtener detalle de un producto por slug
export const getProductDetail = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/detail/${slug}/`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.status === 404 ? 'Producto no encontrado' : 'Error al cargar el producto'
        };
    }
};

// Función para obtener todas las categorías
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories/`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error al cargar categorías'
        };
    }
};

// Función para buscar productos (puede ser útil para autocompletado)
export const searchProducts = async (searchTerm) => {
    try {
        const response = await axios.get(`${API_URL}/catalog/?search=${searchTerm}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Error en la búsqueda'
        };
    }
};

// Función combinada para cargar datos de homepage
export const getHomepageData = async () => {
    try {
        const [featuredRes, newRes] = await Promise.all([
            getFeaturedProducts(),
            getNewProducts()
        ]);

        if (!featuredRes.success || !newRes.success) {
            throw new Error('Error al cargar algunos productos');
        }

        return {
            success: true,
            data: {
                featured: featuredRes.data,
                new: newRes.data
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Error al cargar datos de la página principal'
        };
    }
}; 