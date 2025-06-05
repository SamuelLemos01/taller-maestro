# Componentes React - Frontend

## Descripción General
Este documento describe todos los componentes React utilizados en el frontend de Taller Maestro, incluyendo sus props, estados, métodos y ejemplos de uso.

---

## 📁 Estructura de Componentes
```
taller-maestro/src/components/
├── Navbar.js              # Barra de navegación principal
├── Footer.js               # Pie de página
├── HeroSlider.js          # Carrusel de imágenes principales
├── FeatureCards.js        # Cards de características/servicios
├── ProductsSection.js     # Sección de productos
├── AuthLoader.js          # Loader para verificación de autenticación
├── Navbar.css             # Estilos de Navbar
└── AuthLoader.css         # Estilos de AuthLoader
```

---

## 🧭 Navbar - Barra de Navegación

### Descripción
Componente principal de navegación con menú responsive, gestión de usuario, carrito de compras y sistema de favoritos.

### Ubicación
`taller-maestro/src/components/Navbar.js`

### Dependencias
```javascript
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import { logoutUser } from '../utils/authUtils';
import Swal from 'sweetalert2';
```

### Estados Locales

| Estado | Tipo | Valor Inicial | Descripción |
|--------|------|---------------|-------------|
| `isMenuOpen` | boolean | false | Control del menú móvil |
| `isUserDropdownOpen` | boolean | false | Control del dropdown de usuario |
| `isCartOpen` | boolean | false | Control del dropdown del carrito |
| `showFavorites` | boolean | false | Control del drawer de favoritos |
| `favorites` | array | [] | Lista de productos favoritos |
| `loadingFavorites` | boolean | false | Estado de carga de favoritos |

### Métodos Principales

#### handleLogout()
```javascript
const handleLogout = () => {
  logoutUser(setUser, navigate, false);
  setIsUserDropdownOpen(false);
  Swal.fire({
    icon: 'info',
    title: 'Sesión cerrada',
    text: 'Has cerrado sesión correctamente.',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Entendido'
  });
};
```

#### getInitials(user)
```javascript
const getInitials = (user) => {
  if (!user) return '';
  const first = user.firstName || user.first_name || '';
  const last = user.lastName || user.last_name || '';
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};
```

#### handleRemoveFavorite(id)
```javascript
const handleRemoveFavorite = async (id) => {
  if (!user) return;
  try {
    await removeFromFavorites(id, user, setUser, navigate);
    setFavorites(favorites.filter(fav => fav.id !== id));
    // Mostrar confirmación y actualizar otros componentes
  } catch (error) {
    // Manejo de errores con logout automático si es necesario
  }
};
```

### Características Principales

#### Navegación Responsive
- **Desktop**: Menú horizontal completo
- **Mobile**: Hamburger menu colapsible

#### Gestión de Usuario
- **No autenticado**: Opciones de Login/Registro
- **Autenticado**: Avatar con iniciales, dropdown con opciones

#### Sistema de Favoritos
- Drawer lateral con lista de favoritos
- Eliminación individual de favoritos
- Sincronización automática entre componentes

#### Carrito de Compras
- Dropdown con productos agregados
- Contador de items (actualmente fijo en 0)

### Eventos y Efectos

#### useEffect - Carga de Favoritos
```javascript
useEffect(() => {
  const reloadFavorites = () => {
    if (user) {
      setLoadingFavorites(true);
      getFavorites(user, setUser, navigate)
        .then(setFavorites)
        .catch((error) => setFavorites([]))
        .finally(() => setLoadingFavorites(false));
    }
  };
  
  reloadFavorites();
  window.addEventListener('favorites-updated', reloadFavorites);
  return () => window.removeEventListener('favorites-updated', reloadFavorites);
}, [user, setUser, navigate]);
```

#### useEffect - Click Outside Dropdown
```javascript
useEffect(() => {
  function handleClickOutside(event) {
    if (isUserDropdownOpen && dropdownRef.current && 
        !dropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
  }
  // Agregar/remover listener según estado
}, [isUserDropdownOpen]);
```

### Estructura JSX Principal
```jsx
<nav className="navbar">
  <div className="navbar-container">
    {/* Logo */}
    <div className="navbar-logo">
      <Link to="/"><img src={logo} alt="El Taller del Maestro" /></Link>
    </div>

    {/* Menú de navegación */}
    <div className="navbar-menu">
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
        <li><Link to="/contacto">Contáctenos</Link></li>
      </ul>
    </div>

    {/* Acciones: Carrito y Usuario */}
    <div className="navbar-actions">
      {/* Carrito */}
      {/* Usuario */}
    </div>

    {/* Toggle móvil */}
    <div className="mobile-toggle">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>
    </div>
  </div>

  {/* Drawer de Favoritos */}
  {showFavorites && (
    <>
      <div className="favorites-overlay" onClick={closeFavoritesDrawer}></div>
      <div className="favorites-drawer">
        {/* Contenido de favoritos */}
      </div>
    </>
  )}
</nav>
```

---

## 🔄 AuthLoader - Verificación de Autenticación

### Descripción
Componente que muestra un spinner de carga mientras se verifica el estado de autenticación inicial del usuario.

### Ubicación
`taller-maestro/src/components/AuthLoader.js`

### Dependencias
```javascript
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './AuthLoader.css';
```

### Props
| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `children` | ReactNode | Sí | Componentes hijos a renderizar después de la carga |

### Lógica Principal
```javascript
const AuthLoader = ({ children }) => {
  const { isInitialized } = useContext(UserContext);

  // Mostrar loader mientras se inicializa el contexto
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
```

### Estilos CSS
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-loader-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e0e0e0;
  border-top: 5px solid #3085d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 🖼️ HeroSlider - Carrusel Principal

### Descripción
Carrusel de imágenes principales para la página de inicio con navegación automática y manual.

### Ubicación
`taller-maestro/src/components/HeroSlider.js`

### Props Esperadas
```javascript
// Ejemplo de datos esperados
const slides = [
  {
    id: 1,
    image: '/path/to/image1.jpg',
    title: 'Título del slide',
    subtitle: 'Subtítulo descriptivo',
    buttonText: 'Ver Productos',
    buttonLink: '/catalogo'
  }
];
```

### Estados Internos
- `currentSlide`: Índice del slide actual
- `isAutoPlaying`: Control de reproducción automática

### Funcionalidades
- Navegación automática cada 5 segundos
- Controles manuales (anterior/siguiente)
- Indicadores de posición
- Pausa automática al hover

---

## 🃏 FeatureCards - Cards de Características

### Descripción
Componente para mostrar tarjetas con características o servicios del negocio.

### Ubicación
`taller-maestro/src/components/FeatureCards.js`

### Estructura de Datos
```javascript
const features = [
  {
    icon: 'fas fa-shipping-fast',
    title: 'Envío Rápido',
    description: 'Entrega en 24-48 horas'
  },
  {
    icon: 'fas fa-tools',
    title: 'Herramientas de Calidad',
    description: 'Solo las mejores marcas'
  }
];
```

### Renderizado
```jsx
<div className="feature-cards">
  {features.map((feature, index) => (
    <div key={index} className="feature-card">
      <div className="feature-icon">
        <i className={feature.icon}></i>
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </div>
  ))}
</div>
```

---

## 🛍️ ProductsSection - Sección de Productos

### Descripción
Componente reutilizable para mostrar secciones de productos (destacados, nuevos, etc.)

### Ubicación
`taller-maestro/src/components/ProductsSection.js`

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `title` | string | Sí | Título de la sección |
| `products` | array | Sí | Array de productos a mostrar |
| `loading` | boolean | No | Estado de carga |
| `error` | string | No | Mensaje de error |

### Ejemplo de Uso
```jsx
<ProductsSection
  title="Productos Destacados"
  products={featuredProducts}
  loading={loading}
  error={error}
/>
```

### Estructura de Product
```javascript
{
  id: 1,
  name: "Taladro Black & Decker",
  slug: "taladro-black-decker",
  price: 85000,
  image: "/media/products/taladro.jpg",
  category: { name: "Herramientas Eléctricas" },
  stock: 15,
  is_featured: true,
  is_new: false
}
```

### Funcionalidades
- Grid responsive de productos
- Cards de producto con imagen, nombre, precio
- Navegación a detalle del producto
- Indicadores de estado (nuevo, destacado)
- Manejo de estados de carga y error

---

## 🦶 Footer - Pie de Página

### Descripción
Componente de pie de página con información de contacto, enlaces útiles y redes sociales.

### Ubicación
`taller-maestro/src/components/Footer.js`

### Secciones Principales
1. **Información de Contacto**
   - Dirección física
   - Teléfono
   - Email
   - Horarios de atención

2. **Enlaces Útiles**
   - Navegación principal
   - Políticas
   - Términos y condiciones

3. **Redes Sociales**
   - Facebook
   - Instagram
   - WhatsApp

4. **Copyright**
   - Año actual
   - Nombre de la empresa

---

## 🔗 Comunicación Entre Componentes

### Context API
Todos los componentes principales consumen el `UserContext` para:
- Estado de autenticación
- Información del usuario
- Funciones de logout

### Custom Events
Sistema de eventos personalizados para sincronización:
```javascript
// Disparar evento
window.dispatchEvent(new Event('favorites-updated'));

// Escuchar evento
window.addEventListener('favorites-updated', reloadFavorites);
```

### Props Drilling
Componentes de nivel superior pasan datos a componentes hijos:
```jsx
// HomePage.js
<ProductsSection 
  title="Productos Destacados" 
  products={featuredProducts}
  loading={loading}
  error={error}
/>
```

---

## 🎨 Estilos y CSS

### Convenciones de Clases
- **BEM Methodology**: `block__element--modifier`
- **Prefijos por componente**: `navbar-`, `auth-loader-`, etc.
- **Estados**: `active`, `loading`, `disabled`

### Responsive Design
```css
/* Mobile First */
.navbar-menu {
  display: none;
}

/* Desktop */
@media (min-width: 768px) {
  .navbar-menu {
    display: flex;
  }
}
```

### Variables CSS Comunes
```css
:root {
  --primary-color: #3085d6;
  --danger-color: #d33;
  --success-color: #28a745;
  --border-radius: 8px;
  --transition: 0.3s ease;
}
```

---

## 🧪 Testing de Componentes

### Casos de Prueba Sugeridos

#### Navbar
- Renderizado correcto con/sin usuario
- Funcionalidad de menú móvil
- Carga y visualización de favoritos
- Logout correcto

#### AuthLoader
- Muestra spinner cuando `isInitialized = false`
- Renderiza children cuando `isInitialized = true`

#### ProductsSection
- Renderiza productos correctamente
- Maneja estados de carga y error
- Navegación a detalle funciona

### Ejemplo de Test
```javascript
import { render, screen } from '@testing-library/react';
import { UserProvider } from '../context/UserContext';
import Navbar from './Navbar';

test('renders login link when user not authenticated', () => {
  render(
    <UserProvider>
      <Navbar />
    </UserProvider>
  );
  
  expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
});
```

---

## 📝 Notas de Desarrollo

### Optimizaciones Implementadas
1. **useCallback** para funciones que se pasan como props
2. **useMemo** para cálculos costosos
3. **Lazy loading** de imágenes en ProductsSection
4. **Event listeners** con cleanup en useEffect

### Mejoras Futuras
1. **Virtualización** para listas largas de productos
2. **Service Worker** para cache de imágenes
3. **Skeleton loading** en lugar de spinners simples
4. **Error boundaries** para manejo de errores

### Problemas Conocidos
1. **Carrito**: Funcionalidad no completamente implementada
2. **Imágenes**: No hay fallback para imágenes rotas
3. **Accesibilidad**: Falta implementar ARIA labels en algunos elementos

---

## 🔧 Debugging y Desarrollo

### Console Logs Útiles
```javascript
// En desarrollo, agregar logs para debugging
console.log('User state:', user);
console.log('Favorites loaded:', favorites);
console.log('Auth initialized:', isInitialized);
```

### React DevTools
- Usar React DevTools para inspeccionar props y estado
- Profiler para identificar componentes lentos
- Context inspector para verificar valores del contexto

### Herramientas de Desarrollo
- **React Developer Tools**: Extensión del navegador
- **Redux DevTools**: Si se implementa Redux en el futuro
- **Lighthouse**: Para auditorías de performance 