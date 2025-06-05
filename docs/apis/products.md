# API de Productos - Endpoints

## Descripción General
Esta documentación describe todos los endpoints relacionados con productos, incluyendo catálogo, detalles, categorías y búsquedas.

---

## 🌐 Base URL
```
http://localhost:8000/api/v1/products/
```

---

## 📋 Lista de Productos (Catálogo)

### Endpoint
```
GET /api/v1/products/catalog/
```

### Descripción
Obtiene la lista completa de productos con filtros opcionales para búsqueda y categorización.

### Autenticación
❌ **No requerida**

### Parámetros de Query

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `category` | string | No | Filtrar por nombre de categoría | `?category=Herramientas` |
| `search` | string | No | Buscar en nombre y descripción | `?search=taladro` |

### Ejemplos de Peticiones

#### Obtener todos los productos
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/catalog/');
const products = await response.json();
```

#### Filtrar por categoría
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/catalog/?category=Herramientas Eléctricas');
const products = await response.json();
```

#### Búsqueda de productos
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/catalog/?search=taladro black decker');
const products = await response.json();
```

#### Combinar filtros
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/catalog/?category=Herramientas&search=eléctrico');
const products = await response.json();
```

### Respuesta Exitosa (200)
```json
[
  {
    "id": 1,
    "name": "Taladro Black & Decker 500W",
    "slug": "taladro-black-decker-500w",
    "description": "Taladro eléctrico de 500W con mandril de 1/2 pulgada",
    "price": "85000.00",
    "stock": 15,
    "image": "/media/products/taladro_blackdecker.jpg",
    "category": {
      "id": 1,
      "name": "Herramientas Eléctricas"
    },
    "is_featured": true,
    "is_new": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:25:00Z"
  },
  {
    "id": 2,
    "name": "Martillo de Carpintero Stanley",
    "slug": "martillo-carpintero-stanley",
    "description": "Martillo de 16 oz con mango ergonómico",
    "price": "45000.00",
    "stock": 25,
    "image": "/media/products/martillo_stanley.jpg",
    "category": {
      "id": 2,
      "name": "Herramientas Manuales"
    },
    "is_featured": false,
    "is_new": true,
    "created_at": "2024-01-10T08:15:00Z",
    "updated_at": "2024-01-10T08:15:00Z"
  }
]
```

### Códigos de Error
- **404**: No hay productos que coincidan con los filtros especificados

---

## ⭐ Productos Destacados

### Endpoint
```
GET /api/v1/products/featured/
```

### Descripción
Obtiene todos los productos marcados como destacados (`is_featured = true`).

### Autenticación
❌ **No requerida**

### Ejemplo de Petición
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/featured/');
const featuredProducts = await response.json();
```

### Respuesta Exitosa (200)
```json
[
  {
    "id": 1,
    "name": "Taladro Black & Decker 500W",
    "slug": "taladro-black-decker-500w",
    "description": "Taladro eléctrico de 500W con mandril de 1/2 pulgada",
    "price": "85000.00",
    "stock": 15,
    "image": "/media/products/taladro_blackdecker.jpg",
    "category": {
      "id": 1,
      "name": "Herramientas Eléctricas"
    },
    "is_featured": true,
    "is_new": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:25:00Z"
  }
]
```

### Uso Típico
Este endpoint se usa principalmente en la **página de inicio** para mostrar productos destacados.

---

## 🆕 Productos Nuevos

### Endpoint
```
GET /api/v1/products/new/
```

### Descripción
Obtiene todos los productos marcados como nuevos (`is_new = true`).

### Autenticación
❌ **No requerida**

### Ejemplo de Petición
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/new/');
const newProducts = await response.json();
```

### Respuesta Exitosa (200)
Misma estructura que productos destacados, pero filtrando por `is_new = true`.

### Uso Típico
Este endpoint se usa en la **página de inicio** para mostrar productos nuevos y en secciones especiales del catálogo.

---

## 🔍 Detalle de Producto

### Endpoint
```
GET /api/v1/products/detail/<slug>/
```

### Descripción
Obtiene información detallada de un producto específico usando su slug único.

### Autenticación
❌ **No requerida**

### Parámetros de URL

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `slug` | string | Sí | Slug único del producto | `taladro-black-decker-500w` |

### Ejemplo de Petición
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/detail/taladro-black-decker-500w/');
const product = await response.json();
```

### Respuesta Exitosa (200)
```json
{
  "id": 1,
  "name": "Taladro Black & Decker 500W",
  "slug": "taladro-black-decker-500w",
  "description": "Taladro eléctrico de 500W con mandril de 1/2 pulgada. Ideal para trabajos de carpintería y construcción. Incluye estuche y set de brocas básicas.",
  "price": "85000.00",
  "stock": 15,
  "image": "/media/products/taladro_blackdecker.jpg",
  "category": {
    "id": 1,
    "name": "Herramientas Eléctricas",
    "description": "Herramientas con motor eléctrico"
  },
  "images": [
    {
      "id": 1,
      "image": "/media/products/gallery/taladro_lado1.jpg",
      "alt_text": "Vista lateral del taladro",
      "order": 1
    },
    {
      "id": 2,
      "image": "/media/products/gallery/taladro_accesorios.jpg",
      "alt_text": "Accesorios incluidos",
      "order": 2
    }
  ],
  "is_featured": true,
  "is_new": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:25:00Z"
}
```

### Campos Adicionales en Detalle

| Campo | Descripción |
|-------|-------------|
| `images` | Array de imágenes adicionales del producto |
| `category.description` | Descripción detallada de la categoría |

### Códigos de Error
- **404**: Producto con el slug especificado no encontrado

### Uso en Frontend
```javascript
// En ProductDetailPage.js
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/detail/${slug}/`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await response.json();
      setProduct(data);
      setSelectedImage(data.image); // Imagen principal por defecto
    } catch (err) {
      setError('Error al cargar el producto');
    }
  };
  fetchProduct();
}, [slug]);
```

---

## 🏷️ Categorías

### Endpoint
```
GET /api/v1/products/categories/
```

### Descripción
Obtiene la lista completa de categorías disponibles.

### Autenticación
❌ **No requerida**

### Ejemplo de Petición
```javascript
const response = await fetch('http://localhost:8000/api/v1/products/categories/');
const categories = await response.json();
```

### Respuesta Exitosa (200)
```json
[
  {
    "id": 1,
    "name": "Herramientas Eléctricas",
    "description": "Taladros, sierras, lijadoras y más herramientas con motor eléctrico",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Herramientas Manuales", 
    "description": "Martillos, destornilladores, llaves y herramientas de mano",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 3,
    "name": "Seguridad Industrial",
    "description": "Equipos de protección personal y seguridad laboral",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Uso Típico
- **Menús de navegación**: Para mostrar categorías disponibles
- **Filtros**: Para crear filtros dinámicos en el catálogo
- **Breadcrumbs**: Para navegación jerárquica

---

## 🔄 Flujos de Uso Comunes

### Carga Inicial de Homepage
```javascript
const loadHomepage = async () => {
  try {
    const [featuredRes, newRes] = await Promise.all([
      fetch('http://localhost:8000/api/v1/products/featured/'),
      fetch('http://localhost:8000/api/v1/products/new/')
    ]);
    
    const [featured, newProducts] = await Promise.all([
      featuredRes.json(),
      newRes.json()
    ]);
    
    setFeaturedProducts(featured);
    setNewProducts(newProducts);
  } catch (error) {
    console.error('Error loading homepage products:', error);
  }
};
```

### Navegación por Catálogo
```javascript
const loadCatalog = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  
  const url = `http://localhost:8000/api/v1/products/catalog/?${params}`;
  
  try {
    const response = await fetch(url);
    const products = await response.json();
    setProducts(products);
  } catch (error) {
    console.error('Error loading catalog:', error);
  }
};
```

### Ver Detalle de Producto
```javascript
const loadProductDetail = async (slug) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/products/detail/${slug}/`);
    
    if (!response.ok) {
      throw new Error('Producto no encontrado');
    }
    
    const product = await response.json();
    setProduct(product);
    setSelectedImage(product.image);
  } catch (error) {
    setError(error.message);
  }
};
```

---

## 📊 Estructura de Respuestas

### Producto (Lista/Catálogo)
```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // Decimal como string
  stock: number;
  image: string; // URL de la imagen
  category: {
    id: number;
    name: string;
  } | null;
  is_featured: boolean;
  is_new: boolean;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}
```

### Producto (Detalle)
```typescript
interface ProductDetail extends Product {
  category: {
    id: number;
    name: string;
    description: string;
  } | null;
  images: Array<{
    id: number;
    image: string; // URL de la imagen
    alt_text: string;
    order: number;
  }>;
}
```

### Categoría
```typescript
interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string; // ISO date
}
```

---

## 🚫 Manejo de Errores

### Errores Comunes

#### 404 - Not Found
```json
{
  "detail": "No encontrado."
}
```

**Causas:**
- Slug de producto inexistente
- No hay productos que coincidan con filtros
- URL mal formada

#### 500 - Internal Server Error
```json
{
  "detail": "Error interno del servidor."
}
```

**Causas:**
- Error en la base de datos
- Problema con archivos de imagen
- Error en la lógica del servidor

### Manejo en Frontend
```javascript
const handleApiError = (error, response) => {
  if (response?.status === 404) {
    setError('Producto no encontrado');
  } else if (response?.status >= 500) {
    setError('Error del servidor. Intenta más tarde.');
  } else {
    setError('Error de conexión');
  }
};
```

---

## 🔧 Optimizaciones y Performance

### Recomendaciones de Uso

#### Cache en Frontend
```javascript
// Implementar cache simple para categorías
const getCachedCategories = async () => {
  const cached = localStorage.getItem('categories');
  const timestamp = localStorage.getItem('categories_timestamp');
  
  // Cache válido por 1 hora
  if (cached && timestamp && Date.now() - timestamp < 3600000) {
    return JSON.parse(cached);
  }
  
  const response = await fetch('/api/v1/products/categories/');
  const categories = await response.json();
  
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('categories_timestamp', Date.now().toString());
  
  return categories;
};
```

#### Debounce para Búsquedas
```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (searchTerm) => {
  if (searchTerm.length >= 3) {
    const response = await fetch(`/api/v1/products/catalog/?search=${searchTerm}`);
    const products = await response.json();
    setSearchResults(products);
  }
}, 300);
```

### Paginación (Futura Implementación)
```javascript
// Cuando se implemente paginación
const loadProducts = async (page = 1, pageSize = 20) => {
  const response = await fetch(
    `/api/v1/products/catalog/?page=${page}&page_size=${pageSize}`
  );
  const data = await response.json();
  
  return {
    products: data.results,
    total: data.count,
    hasNext: !!data.next,
    hasPrev: !!data.previous
  };
};
```

---

## 📝 Notas de Desarrollo

### Consideraciones Importantes
1. **Slugs únicos**: Cada producto debe tener un slug único y descriptivo
2. **Imágenes**: Las URLs son relativas, agregar base URL en frontend
3. **Precios**: Se devuelven como string para evitar problemas de precisión
4. **Stock**: Verificar disponibilidad antes de mostrar opciones de compra
5. **Filtros**: Los filtros son case-insensitive y usan `icontains`

### Próximas Funcionalidades
- **Paginación**: Para listas grandes de productos
- **Ordenamiento**: Por precio, nombre, fecha, popularidad
- **Filtros avanzados**: Por rango de precio, múltiples categorías
- **Búsqueda avanzada**: Con relevancia y highlighting
- **Productos relacionados**: En página de detalle 