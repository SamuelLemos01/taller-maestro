# Utilidades - Frontend

## Descripción General
Este documento describe todas las funciones de utilidad del frontend, especialmente el sistema de autenticación JWT y manejo de tokens.

---

## 📁 Estructura de Utilidades
```
taller-maestro/src/utils/
└── authUtils.js              # Utilidades de autenticación JWT
```

---

## 🔐 authUtils.js - Sistema de Autenticación

### Descripción
Conjunto de funciones utilitarias para manejar autenticación JWT, verificación de tokens, renovación automática y logout seguro.

### Ubicación
`taller-maestro/src/utils/authUtils.js`

### Dependencias
```javascript
import axios from 'axios';
```

### Configuración
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## 🔍 isTokenExpired(token)

### Descripción
Verifica si un token JWT ha expirado decodificando su payload y comparando con el tiempo actual.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `token` | string | Sí | Token JWT a verificar |

### Retorna
`boolean` - `true` si el token ha expirado o es inválido, `false` si aún es válido

### Lógica Interna
```javascript
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
```

### Ejemplo de Uso
```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

if (isTokenExpired(token)) {
  console.log('Token expirado, necesita renovación');
} else {
  console.log('Token válido');
}
```

### Notas Importantes
- **Margen de seguridad**: Se considera expirado 60 segundos antes del tiempo real
- **Manejo de errores**: Si no se puede decodificar, se considera expirado
- **Decodificación manual**: Usa `atob()` para evitar dependencias adicionales

---

## 🔄 refreshAuthToken(refreshToken)

### Descripción
Función asíncrona que renueva un access token usando el refresh token.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `refreshToken` | string | Sí | Refresh token para renovar el access token |

### Retorna
`Promise<Object>` con la estructura:
```javascript
// Éxito
{
  success: true,
  accessToken: "nuevo_access_token",
  refreshToken: "nuevo_refresh_token" // Puede ser el mismo si no rota
}

// Error
{
  success: false,
  error: "descripción del error"
}
```

### Implementación
```javascript
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
```

### Ejemplo de Uso
```javascript
const refreshResult = await refreshAuthToken(user.refreshToken);

if (refreshResult.success) {
  // Actualizar usuario con nuevo token
  setUser(prevUser => ({
    ...prevUser,
    token: refreshResult.accessToken
  }));
} else {
  // Manejar error - probablemente hacer logout
  console.error('No se pudo renovar token:', refreshResult.error);
}
```

---

## 🚪 logoutUser(setUser, navigate, showAlert)

### Descripción
Función que realiza logout completo limpiando todos los datos de autenticación y redirigiendo al usuario.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción | Valor por Defecto |
|-----------|------|-----------|-------------|-------------------|
| `setUser` | function | Sí | Función para actualizar contexto de usuario | - |
| `navigate` | function | Sí | Función de navegación de React Router | - |
| `showAlert` | boolean | No | Si mostrar alerta de confirmación | `true` |

### Funcionalidad
```javascript
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
```

### Ejemplo de Uso
```javascript
// Con alerta
logoutUser(setUser, navigate);

// Sin alerta (logout silencioso)
logoutUser(setUser, navigate, false);
```

### Acciones Realizadas
1. **Limpia localStorage**: Remueve `user` y `refreshToken`
2. **Actualiza contexto**: Establece usuario como `null`
3. **Muestra alerta**: SweetAlert2 informativa (opcional)
4. **Redirige**: Navega a `/login`

---

## ✅ checkAndRefreshToken(user, setUser, navigate)

### Descripción
Función principal que verifica la validez de tokens y renueva automáticamente si es necesario.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `user` | object | Sí | Objeto de usuario con token |
| `setUser` | function | Sí | Función para actualizar usuario |
| `navigate` | function | Sí | Función de navegación |

### Retorna
`Promise<boolean>` - `true` si el usuario tiene tokens válidos, `false` si necesita reautenticación

### Flujo de Lógica
```javascript
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
```

### Casos de Uso
1. **Token válido**: Retorna `true` inmediatamente
2. **Access token expirado, refresh válido**: Renueva y retorna `true`
3. **Ambos tokens expirados**: Hace logout y retorna `false`
4. **Error de red**: Hace logout y retorna `false`

### Ejemplo de Uso
```javascript
// Antes de hacer una petición autenticada
const isAuthenticated = await checkAndRefreshToken(user, setUser, navigate);

if (isAuthenticated) {
  // Proceder con la petición
  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });
} else {
  // Usuario no autenticado, ya se redirigió al login
  return;
}
```

---

## 🔧 setupAxiosInterceptors(user, setUser, navigate)

### Descripción
Configura interceptores globales de Axios para manejo automático de autenticación en todas las peticiones.

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `user` | object | Sí | Objeto de usuario actual |
| `setUser` | function | Sí | Función para actualizar usuario |
| `navigate` | function | Sí | Función de navegación |

### Funcionalidad

#### Request Interceptor
```javascript
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
```

#### Response Interceptor
```javascript
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
```

### Ejemplo de Uso
```javascript
// En el componente principal o contexto
useEffect(() => {
  if (user) {
    setupAxiosInterceptors(user, setUser, navigate);
  }
}, [user, setUser, navigate]);
```

### Beneficios
1. **Automático**: No necesitas manejar tokens en cada petición
2. **Transparente**: Las peticiones funcionan normalmente
3. **Resiliente**: Reintenta automáticamente con tokens renovados
4. **Centralizado**: Un solo lugar para manejar errores de autenticación

---

## 🔄 Flujo Completo de Autenticación

### Diagrama de Flujo
```
┌─────────────────┐
│ Usuario hace    │
│ petición HTTP   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Request         │
│ Interceptor     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      ┌─────────────────┐
│ ¿Token válido?  │─No──▶│ Renovar token   │
└─────────┬───────┘      └─────────┬───────┘
          │Yes                     │
          ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│ Agregar token   │      │ ¿Renovación OK? │
│ a headers       │      └─────────┬───────┘
└─────────┬───────┘                │
          │                        ▼
          ▼              ┌─────────────────┐
┌─────────────────┐      │ Logout y        │
│ Enviar petición │      │ redirigir       │
└─────────┬───────┘      └─────────────────┘
          │
          ▼
┌─────────────────┐
│ ¿Error 401?     │─No──▶ Respuesta exitosa
└─────────┬───────┘
          │Yes
          ▼
┌─────────────────┐
│ Response        │
│ Interceptor     │
│ - Renovar token │
│ - Reintentar    │
└─────────────────┘
```

### Casos de Uso Cubiertos

#### Escenario 1: Token Válido
- ✅ Petición se envía normalmente
- ✅ Token se agrega automáticamente
- ✅ Respuesta exitosa

#### Escenario 2: Access Token Expirado
- ⚠️ Interceptor detecta token expirado
- 🔄 Renueva automáticamente con refresh token
- ✅ Reenvía petición con nuevo token
- ✅ Usuario no se entera del proceso

#### Escenario 3: Ambos Tokens Expirados
- ❌ No se puede renovar
- 🚪 Logout automático
- 🔄 Redirección a login
- 💬 Mensaje informativo al usuario

#### Escenario 4: Error de Red
- ❌ Falla la renovación
- 🚪 Logout por seguridad
- 🔄 Redirección a login

---

## 📱 Integración con Servicios

### favoritesService.js
```javascript
import { checkAndRefreshToken } from '../utils/authUtils';

const makeAuthenticatedRequest = async (requestFunction, user, setUser, navigate) => {
  // Verificar autenticación antes de cada petición
  const isValid = await checkAndRefreshToken(user, setUser, navigate);
  if (!isValid) {
    throw new Error('Sesión expirada');
  }
  
  return await requestFunction();
};
```

### Componentes React
```javascript
// En ProductDetailPage.js
const handleAddToFavorites = async () => {
  try {
    await addToFavorites(product.id, user, setUser, navigate);
    // Éxito automático si no hay excepciones
  } catch (error) {
    if (error.message === 'Sesión expirada') {
      // Ya se manejó automáticamente
      return;
    }
    // Manejar otros errores
  }
};
```

---

## 🔒 Consideraciones de Seguridad

### Buenas Prácticas Implementadas
1. **Tokens de corta duración**: Access token 30 min
2. **Renovación automática**: Sin intervención del usuario
3. **Limpieza completa**: localStorage y contexto
4. **Margen de seguridad**: 60 segundos antes de expiración
5. **Manejo de errores**: Logout automático en fallos

### Datos Sensibles
- **Access Token**: Solo en memoria (contexto React)
- **Refresh Token**: localStorage con limpieza automática
- **Passwords**: Nunca almacenados localmente

### Vulnerabilidades Mitigadas
- **Token expirado**: Renovación automática
- **XSS básico**: Tokens no en cookies
- **CSRF**: Uso de headers Authorization
- **Logout incompleto**: Limpieza exhaustiva

---

## 🧪 Testing

### Casos de Prueba Recomendados

#### isTokenExpired()
```javascript
describe('isTokenExpired', () => {
  test('returns true for null token', () => {
    expect(isTokenExpired(null)).toBe(true);
  });
  
  test('returns true for expired token', () => {
    const expiredToken = 'eyJ...'; // Token con exp pasado
    expect(isTokenExpired(expiredToken)).toBe(true);
  });
  
  test('returns false for valid token', () => {
    const validToken = 'eyJ...'; // Token con exp futuro
    expect(isTokenExpired(validToken)).toBe(false);
  });
});
```

#### checkAndRefreshToken()
```javascript
describe('checkAndRefreshToken', () => {
  test('returns true for valid token', async () => {
    const result = await checkAndRefreshToken(userWithValidToken, setUser, navigate);
    expect(result).toBe(true);
  });
  
  test('refreshes expired access token', async () => {
    const result = await checkAndRefreshToken(userWithExpiredAccess, setUser, navigate);
    expect(result).toBe(true);
    expect(setUser).toHaveBeenCalledWith(expect.objectContaining({
      token: 'new_access_token'
    }));
  });
});
```

---

## 📝 Notas de Desarrollo

### Optimizaciones Futuras
1. **Cache de verificación**: Evitar verificar el mismo token múltiples veces
2. **Retry logic**: Reintentos con backoff exponencial
3. **Metrics**: Tracking de renovaciones de tokens
4. **Notificaciones**: Alertas sutiles cuando se renueva

### Limitaciones Actuales
1. **Single tab**: No sincronización entre pestañas
2. **Network offline**: No manejo de modo offline
3. **Rate limiting**: Sin throttling de peticiones de renovación

### Debugging
```javascript
// Agregar logs en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Token check result:', isValid);
  console.log('User state:', user);
  console.log('LocalStorage tokens:', {
    user: localStorage.getItem('user'),
    refresh: localStorage.getItem('refreshToken')
  });
}
```

---

## 🚀 Extensiones Posibles

### Multi-tab Synchronization
```javascript
// Escuchar cambios en localStorage
window.addEventListener('storage', (e) => {
  if (e.key === 'user' && !e.newValue) {
    // Otro tab hizo logout
    setUser(null);
    navigate('/login');
  }
});
```

### Offline Support
```javascript
// Detectar estado de conexión
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

### Token Refresh Warning
```javascript
// Advertir al usuario antes de que expire
const warnBeforeExpiry = (token) => {
  if (!token) return;
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiryTime = payload.exp * 1000;
  const warningTime = expiryTime - (5 * 60 * 1000); // 5 min antes
  
  setTimeout(() => {
    toast.info('Tu sesión expirará pronto. ¿Deseas extenderla?');
  }, warningTime - Date.now());
};
``` 