# Vistas y ViewSets - Backend Django

## Descripción General
Este documento describe todas las vistas y ViewSets del backend, incluyendo la lógica de negocio, autenticación y permisos.

---

## 📁 Ubicación
```
taller-maestro-backend/
├── auth_user/views.py           # Vistas de autenticación personalizada
└── products/views.py            # ViewSets y vistas de productos
```

---

## 🔐 Autenticación - EmailTokenObtainPairView

### Descripción
Vista personalizada para obtener tokens JWT usando email en lugar de username.

### Ubicación
`taller-maestro-backend/auth_user/views.py`

### Clase Base
Extiende `TokenObtainPairView` de `rest_framework_simplejwt`

### Funcionalidad
```python
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
```

### Endpoint Asociado
- **URL**: `/api/token/`
- **Método**: `POST`
- **Autenticación**: No requerida

### Ejemplo de Uso
```javascript
// Frontend
const response = await fetch('http://localhost:8000/api/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Respuesta: { access: "token...", refresh: "token...", first_name: "Juan", last_name: "Pérez", email: "usuario@example.com" }
```

---

## 📝 Vistas de Registro y Login (Funciones)

### signup_user

#### Descripción
Vista funcional para registro de nuevos usuarios con validación completa.

#### Ubicación
`taller-maestro-backend/auth_user/views.py`

#### Parámetros de Entrada
```json
{
    "firstName": "Juan",
    "lastName": "Pérez", 
    "phone": "1234567890",
    "email": "juan@example.com",
    "password": "password123"
}
```

#### Validaciones
- Todos los campos requeridos presentes
- Email único (no registrado previamente)
- Formato de email válido

#### Respuesta Exitosa (201)
```json
{
    "message": "Usuario registrado exitosamente",
    "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com",
        "phone": "1234567890"
    }
}
```

#### Errores Posibles
- `400`: Campo requerido faltante
- `400`: Email ya registrado
- `400`: Datos JSON inválidos

### login_user

#### Descripción
Vista funcional para login que valida credenciales y devuelve datos del usuario.

#### Ubicación
`taller-maestro-backend/auth_user/views.py`

#### Parámetros de Entrada
```json
{
    "email": "juan@example.com",
    "password": "password123"
}
```

#### Respuesta Exitosa (200)
```json
{
    "message": "Inicio de sesión exitoso",
    "user": {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@example.com",
        "phone": "1234567890"
    }
}
```

#### Errores Posibles
- `400`: Email o contraseña faltantes
- `401`: Credenciales incorrectas

---

## 🛍️ ProductListView - Lista de Productos

### Descripción
Vista genérica para obtener lista paginada de productos con filtros opcionales.

### Ubicación
`taller-maestro-backend/products/views.py`

### Clase Base
`generics.ListAPIView`

### Configuración
```python
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset
```

### Endpoint Asociado
- **URL**: `/api/v1/products/catalog/`
- **Método**: `GET`
- **Parámetros de Query**: 
  - `category` (opcional): Filtrar por categoría
  - `search` (opcional): Buscar en nombre y descripción

### Ejemplo de Uso
```javascript
// Obtener todos los productos
GET /api/v1/products/catalog/

// Filtrar por categoría
GET /api/v1/products/catalog/?category=Herramientas

// Buscar productos
GET /api/v1/products/catalog/?search=taladro

// Combinar filtros
GET /api/v1/products/catalog/?category=Herramientas&search=eléctrico
```

---

## ⭐ FeaturedProductListView - Productos Destacados

### Descripción
Vista para obtener productos marcados como destacados.

### Ubicación
`taller-maestro-backend/products/views.py`

### Configuración
```python
class FeaturedProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(is_featured=True)
```

### Endpoint Asociado
- **URL**: `/api/v1/products/featured/`
- **Método**: `GET`
- **Autenticación**: No requerida

---

## 🆕 NewProductListView - Productos Nuevos

### Descripción
Vista para obtener productos marcados como nuevos.

### Ubicación
`taller-maestro-backend/products/views.py`

### Configuración
```python
class NewProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(is_new=True)
```

### Endpoint Asociado
- **URL**: `/api/v1/products/new/`
- **Método**: `GET`
- **Autenticación**: No requerida

---

## 🏷️ CategoryListView - Lista de Categorías

### Descripción
Vista para obtener todas las categorías disponibles.

### Ubicación
`taller-maestro-backend/products/views.py`

### Configuración
```python
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
```

### Endpoint Asociado
- **URL**: `/api/v1/products/categories/`
- **Método**: `GET`
- **Autenticación**: No requerida

---

## 🔍 ProductDetailView - Detalle de Producto

### Descripción
Vista para obtener información detallada de un producto específico por slug.

### Ubicación
`taller-maestro-backend/products/views.py`

### Configuración
```python
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
```

### Endpoint Asociado
- **URL**: `/api/v1/products/detail/<slug>/`
- **Método**: `GET`
- **Autenticación**: No requerida

### Ejemplo de Uso
```javascript
// Obtener detalle de producto
GET /api/v1/products/detail/taladro-black-decker-500w/
```

---

## ❤️ FavoriteViewSet - Gestión de Favoritos

### Descripción
ViewSet completo para CRUD de favoritos del usuario autenticado.

### Ubicación
`taller-maestro-backend/products/views.py`

### Clase Base
`viewsets.ModelViewSet`

### Configuración
```python
class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

### Endpoints Asociados
- **Lista**: `GET /api/v1/products/favorites/`
- **Crear**: `POST /api/v1/products/favorites/`
- **Detalle**: `GET /api/v1/products/favorites/{id}/`
- **Eliminar**: `DELETE /api/v1/products/favorites/{id}/`

### Autenticación
**Requerida**: JWT Token en header `Authorization: Bearer <token>`

### Métodos Disponibles

#### GET - Listar Favoritos
```javascript
// Headers: Authorization: Bearer <token>
GET /api/v1/products/favorites/

// Respuesta
[
    {
        "id": 1,
        "user": 1,
        "product": {
            "id": 5,
            "name": "Taladro Black & Decker",
            "price": "85000.00",
            "image": "/media/products/taladro.jpg"
        },
        "created_at": "2024-01-15T10:30:00Z"
    }
]
```

#### POST - Agregar a Favoritos
```javascript
// Headers: Authorization: Bearer <token>
POST /api/v1/products/favorites/
Content-Type: application/json

{
    "product_id": 5
}

// Respuesta (201)
{
    "id": 1,
    "user": 1,
    "product": { /* datos del producto */ },
    "created_at": "2024-01-15T10:30:00Z"
}
```

#### DELETE - Eliminar Favorito
```javascript
// Headers: Authorization: Bearer <token>
DELETE /api/v1/products/favorites/1/

// Respuesta (204 No Content)
```

### Validaciones Automáticas
- **Unicidad**: Un usuario no puede agregar el mismo producto dos veces
- **Autenticación**: Solo usuarios autenticados pueden gestionar favoritos
- **Propiedad**: Los usuarios solo pueden ver/modificar sus propios favoritos

---

## 🔒 Permisos y Autenticación

### Configuración Global
En `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### Niveles de Acceso

#### Público (Sin Autenticación)
- Lista de productos
- Detalle de producto
- Lista de categorías
- Productos destacados/nuevos

#### Autenticado (JWT Token)
- Gestión completa de favoritos
- Información específica del usuario

---

## 🚫 Manejo de Errores

### Errores Comunes por Vista

#### ProductListView
- `404`: No hay productos que coincidan con los filtros

#### ProductDetailView
- `404`: Producto con slug no encontrado

#### FavoriteViewSet
- `401`: Token JWT inválido o expirado
- `400`: Producto ya está en favoritos
- `404`: Favorito no encontrado (o no pertenece al usuario)

### Formato de Respuesta de Error
```json
{
    "detail": "Mensaje de error descriptivo",
    "code": "error_code"
}
```

---

## 🔄 Flujo de Datos Típico

### Carga Inicial de Productos
1. `GET /api/v1/products/featured/` - Productos destacados para homepage
2. `GET /api/v1/products/new/` - Productos nuevos para homepage  
3. `GET /api/v1/products/categories/` - Categorías para navegación

### Navegación de Catálogo
1. `GET /api/v1/products/catalog/` - Lista completa
2. `GET /api/v1/products/catalog/?category=X` - Filtrar por categoría
3. `GET /api/v1/products/detail/<slug>/` - Ver detalle

### Gestión de Favoritos
1. Login: `POST /api/token/` - Obtener tokens
2. `GET /api/v1/products/favorites/` - Cargar favoritos del usuario
3. `POST /api/v1/products/favorites/` - Agregar nuevo favorito
4. `DELETE /api/v1/products/favorites/{id}/` - Eliminar favorito

---

## 📝 Notas de Rendimiento

### Optimizaciones Implementadas
- **select_related**: Para relaciones ForeignKey (category en productos)
- **prefetch_related**: Para relaciones inversas (imágenes de productos)
- **Filtros en base de datos**: No filtrado en Python

### Optimizaciones Recomendadas
- Paginación para listas grandes
- Cache para productos destacados/nuevos
- Índices en campos de búsqueda frecuente

---

## 🧪 Testing

### Comandos de Prueba
```bash
# Ejecutar tests
python manage.py test

# Test específico
python manage.py test products.tests.ProductViewsTest
```

### Casos de Prueba Importantes
1. Autenticación con email
2. Filtros de productos
3. Restricciones de favoritos
4. Permisos de usuario
5. Validación de datos de entrada 