# Modelos de Datos - Backend Django

## Descripción General
Este documento describe todos los modelos de datos utilizados en el backend de Taller Maestro, incluyendo sus campos, relaciones y métodos especiales.

---

## 📁 Ubicación
```
taller-maestro-backend/
├── auth_user/models.py          # Modelo de Usuario personalizado
└── products/models.py           # Modelos de Productos, Categorías y Favoritos
```

---

## 👤 Modelo User (Usuario Personalizado)

### Descripción
Modelo de usuario personalizado que extiende `AbstractBaseUser` y `PermissionsMixin` para usar email como identificador único en lugar de username.

### Ubicación
`taller-maestro-backend/auth_user/models.py`

### Campos

| Campo | Tipo | Propiedades | Descripción |
|-------|------|-------------|-------------|
| `email` | EmailField | unique=True | Email único del usuario (USERNAME_FIELD) |
| `first_name` | CharField | max_length=50 | Nombre del usuario |
| `last_name` | CharField | max_length=50 | Apellido del usuario |
| `phone` | CharField | max_length=10, blank=True | Teléfono (opcional) |
| `agree_terms` | BooleanField | default=False | Aceptación de términos |
| `is_active` | BooleanField | default=True | Usuario activo |
| `is_staff` | BooleanField | default=False | Acceso al admin |
| `date_joined` | DateTimeField | auto_now_add=True | Fecha de registro |

### Manager Personalizado
`UserManager` con métodos:
- `create_user(email, password=None, **extra_fields)`
- `create_superuser(email, password=None, **extra_fields)`

### Configuración
```python
USERNAME_FIELD = 'email'
REQUIRED_FIELDS = ['first_name', 'last_name']
```

### Método String
```python
def __str__(self):
    return f"{self.first_name} {self.last_name} ({self.email})"
```

### Ejemplo de Uso
```python
# Crear usuario
user = User.objects.create_user(
    email="juan@example.com",
    password="password123",
    first_name="Juan",
    last_name="Pérez",
    phone="1234567890"
)

# Crear superusuario
admin = User.objects.create_superuser(
    email="admin@tallermae
stro.com",
    password="admin123",
    first_name="Admin",
    last_name="Sistema"
)
```

---

## 🏷️ Modelo Category (Categoría)

### Descripción
Categorías para organizar los productos del taller (ej: Herramientas Eléctricas, Manuales, etc.)

### Ubicación
`taller-maestro-backend/products/models.py`

### Campos

| Campo | Tipo | Propiedades | Descripción |
|-------|------|-------------|-------------|
| `name` | CharField | max_length=100, unique=True | Nombre de la categoría |
| `description` | TextField | blank=True, null=True | Descripción opcional |
| `created_at` | DateTimeField | auto_now_add=True | Fecha de creación |

### Método String
```python
def __str__(self):
    return self.name
```

### Ejemplo de Uso
```python
# Crear categoría
category = Category.objects.create(
    name="Herramientas Eléctricas",
    description="Taladros, sierras, lijadoras y más"
)
```

---

## 🛠️ Modelo Product (Producto)

### Descripción
Productos principales del e-commerce con toda la información necesaria para venta.

### Ubicación
`taller-maestro-backend/products/models.py`

### Campos

| Campo | Tipo | Propiedades | Descripción |
|-------|------|-------------|-------------|
| `name` | CharField | max_length=200 | Nombre del producto |
| `slug` | SlugField | unique=True | URL amigable del producto |
| `description` | TextField | - | Descripción detallada |
| `price` | DecimalField | max_digits=10, decimal_places=2 | Precio en pesos colombianos |
| `stock` | PositiveIntegerField | default=0 | Cantidad en inventario |
| `image` | ImageField | upload_to='products/' | Imagen principal |
| `category` | ForeignKey | Category, null=True, blank=True | Categoría del producto |
| `is_featured` | BooleanField | default=False | Producto destacado |
| `is_new` | BooleanField | default=False | Producto nuevo |
| `created_at` | DateTimeField | auto_now_add=True | Fecha de creación |
| `updated_at` | DateTimeField | auto_now=True | Última actualización |

### Método String
```python
def __str__(self):
    return self.name
```

### Meta Class
```python
class Meta:
    ordering = ['-created_at']  # Ordenar por más recientes
```

### Ejemplo de Uso
```python
# Crear producto
product = Product.objects.create(
    name="Taladro Black & Decker 500W",
    slug="taladro-black-decker-500w",
    description="Taladro eléctrico de 500W con mandril de 1/2 pulgada",
    price=85000,
    stock=15,
    category=Category.objects.get(name="Herramientas Eléctricas"),
    is_featured=True,
    is_new=True
)
```

---

## 🖼️ Modelo ProductImage (Imágenes Adicionales)

### Descripción
Imágenes adicionales para productos (galería de fotos)

### Ubicación
`taller-maestro-backend/products/models.py`

### Campos

| Campo | Tipo | Propiedades | Descripción |
|-------|------|-------------|-------------|
| `product` | ForeignKey | Product, related_name='images' | Producto asociado |
| `image` | ImageField | upload_to='products/gallery/' | Imagen adicional |
| `alt_text` | CharField | max_length=200, blank=True | Texto alternativo |
| `order` | PositiveIntegerField | default=0 | Orden de visualización |

### Relación con Product
```python
# Un producto puede tener múltiples imágenes
product.images.all()  # Obtener todas las imágenes
```

### Meta Class
```python
class Meta:
    ordering = ['order']  # Ordenar por campo order
```

---

## ❤️ Modelo Favorite (Favoritos)

### Descripción
Relación entre usuarios y productos favoritos con restricción de unicidad.

### Ubicación
`taller-maestro-backend/products/models.py`

### Campos

| Campo | Tipo | Propiedades | Descripción |
|-------|------|-------------|-------------|
| `user` | ForeignKey | AUTH_USER_MODEL, related_name='favorites' | Usuario que marca favorito |
| `product` | ForeignKey | Product, related_name='favorited_by' | Producto marcado como favorito |
| `created_at` | DateTimeField | auto_now_add=True | Fecha cuando se marcó como favorito |

### Restricción de Unicidad
```python
class Meta:
    unique_together = ('user', 'product')  # Un usuario no puede marcar el mismo producto dos veces
```

### Método String
```python
def __str__(self):
    return f"{self.user.first_name} - {self.product.name}"
```

### Ejemplo de Uso
```python
# Agregar a favoritos
favorite = Favorite.objects.create(
    user=user,
    product=product
)

# Verificar si ya está en favoritos
is_favorite = Favorite.objects.filter(user=user, product=product).exists()

# Obtener favoritos del usuario
user_favorites = user.favorites.all()

# Obtener usuarios que marcaron el producto como favorito
product_fans = product.favorited_by.all()
```

---

## 🔗 Relaciones Entre Modelos

### Diagrama de Relaciones
```
User (1) -------- (*) Favorite (*) -------- (1) Product
                                                 |
                                                 |
                                            Category (1) -------- (*) Product
                                                 |
                                            Product (1) -------- (*) ProductImage
```

### Consultas Comunes
```python
# Productos favoritos de un usuario
user.favorites.select_related('product').all()

# Productos de una categoría
Category.objects.get(name="Herramientas").product_set.all()

# Productos destacados con sus imágenes
Product.objects.filter(is_featured=True).prefetch_related('images')

# Usuarios que tienen un producto específico en favoritos
product.favorited_by.select_related('user').all()
```

---

## ⚙️ Configuraciones Importantes

### Settings.py
```python
# Modelo de usuario personalizado
AUTH_USER_MODEL = 'auth_user.User'

# Configuración de archivos media
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Migraciones
Para aplicar los modelos:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 🧪 Datos de Prueba

### Crear datos de ejemplo
```python
# En Django Shell
python manage.py shell

from auth_user.models import User
from products.models import Category, Product, Favorite

# Crear usuario de prueba
user = User.objects.create_user(
    email="test@example.com",
    password="test123",
    first_name="Test",
    last_name="User"
)

# Crear categoría
category = Category.objects.create(
    name="Herramientas Manuales",
    description="Martillos, destornilladores, llaves"
)

# Crear producto
product = Product.objects.create(
    name="Martillo de Carpintero",
    slug="martillo-carpintero",
    description="Martillo de 16 oz con mango de madera",
    price=25000,
    stock=50,
    category=category,
    is_featured=True
)
```

---

## 📝 Notas Importantes

1. **Usuario Personalizado**: Se usa email en lugar de username para autenticación
2. **Slug Único**: Cada producto debe tener un slug único para URLs amigables
3. **Restricción de Favoritos**: Un usuario no puede marcar el mismo producto como favorito múltiples veces
4. **Imágenes**: Se almacenan en el directorio `media/products/`
5. **Decimal para Precios**: Se usa DecimalField para evitar problemas de precisión monetaria
6. **Soft Delete**: No implementado - los registros se eliminan físicamente
7. **Timestamps**: Todos los modelos importantes tienen `created_at` para auditoría 