import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Función para verificar si un token JWT ha expirado
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decodificar el payload del JWT 
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000; // Convertir a segundos
    
    // Verificar si el token ha expirado (con un margen de 60 segundos)
    return payload.exp < (currentTime + 60);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true; // Si no se puede decodificar, considerar expirado
  }
};

// Función para renovar el token usando el refresh token
export const refreshAuthToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken
    });
    
    return {
      success: true,
      accessToken: response.data.access,
      refreshToken: response.data.refresh || refreshToken // Algunos configs no rotan el refresh
    };
  } catch (error) {
    console.error('Error al renovar token:', error);
    return {
      success: false,
      error: error.response?.data || 'Error de conexión'
    };
  }
};

// Función para hacer logout y limpiar datos
export const logoutUser = (setUser, navigate, showAlert = true) => {
  // Limpiar localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  
  // Limpiar contexto
  setUser(null);
  
  if (showAlert) {
    import('sweetalert2').then(Swal => {
      Swal.default.fire({
        icon: 'info',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ir al login'
      }).then(() => {
        navigate('/login');
      });
    });
  } else {
    navigate('/login');
  }
};

// Función para verificar y renovar token automáticamente
export const checkAndRefreshToken = async (user, setUser, navigate) => {
  if (!user || !user.token) {
    return false;
  }
  
  // Si el token access no ha expirado, está bien
  if (!isTokenExpired(user.token)) {
    return true;
  }
  
  // Token access expirado, intentar renovar
  const refreshToken = localStorage.getItem('refreshToken') || user.refreshToken;
  
  if (!refreshToken || isTokenExpired(refreshToken)) {
    // Refresh token también expirado o no existe
    logoutUser(setUser, navigate);
    return false;
  }
  
  // Intentar renovar
  const refreshResult = await refreshAuthToken(refreshToken);
  
  if (refreshResult.success) {
    // Actualizar usuario con nuevo token
    const updatedUser = {
      ...user,
      token: refreshResult.accessToken
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Guardar nuevo refresh token si se rotó
    if (refreshResult.refreshToken !== refreshToken) {
      localStorage.setItem('refreshToken', refreshResult.refreshToken);
    }
    
    return true;
  } else {
    // Error al renovar, hacer logout
    logoutUser(setUser, navigate);
    return false;
  }
};

// Interceptor para axios que maneja automáticamente la renovación de tokens
export const setupAxiosInterceptors = (user, setUser, navigate) => {
  // Request interceptor - agregar token a todas las peticiones
  axios.interceptors.request.use(
    async (config) => {
      if (user && user.token) {
        // Verificar y renovar token si es necesario antes de cada petición
        const isValid = await checkAndRefreshToken(user, setUser, navigate);
        if (isValid) {
          // Obtener el token actualizado del contexto
          const currentUser = JSON.parse(localStorage.getItem('user'));
          config.headers.Authorization = `Bearer ${currentUser.token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - manejar errores 401
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && user) {
        // Token inválido o expirado, intentar renovar una vez más
        const isValid = await checkAndRefreshToken(user, setUser, navigate);
        
        if (isValid) {
          // Reintentar la petición original con el nuevo token
          const currentUser = JSON.parse(localStorage.getItem('user'));
          error.config.headers.Authorization = `Bearer ${currentUser.token}`;
          return axios.request(error.config);
        }
      }
      return Promise.reject(error);
    }
  );
}; 