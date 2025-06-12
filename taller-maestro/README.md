# Taller del Maestro

## Descripción
Tienda online de productos artesanales con carrito de compras, panel de favoritos por usuario y autenticación segura con JWT (login por email).

## Características principales
- **Catálogo de productos** con filtros y búsqueda avanzada.
- **Carrito de compras** con drawer lateral y gestión de cantidades.
- **Panel de favoritos** único por usuario (requiere autenticación).
- **Autenticación JWT** usando email (no username).
- **Seguridad reforzada**: expiración y rotación de tokens, blacklist, CORS seguro.
- **Arquitectura full-stack**: Backend en Django + DRF, frontend en React.
- **Diseño responsive** y experiencia de usuario moderna.

## Arquitectura del Proyecto

### **Frontend (React)**
- **React 17** con React Router para navegación SPA
- **Axios** para comunicación HTTP con el backend
- **Context API** para manejo del estado global (usuario, carrito, favoritos)
- **SweetAlert2** para notificaciones y confirmaciones
- **Font Awesome** para iconografía
- **CSS personalizado** con diseño responsive

### **Backend (Django REST Framework)**
- **Django 5.2+** como framework principal
- **Django REST Framework** para APIs REST
- **JWT (Simple JWT)** para autenticación stateless
- **CORS Headers** para comunicación frontend-backend
- **SQLite** como base de datos (desarrollo)

## Funcionalidades Principales

### **🛒 Carrito de Compras**
- **Drawer lateral** con diseño consistente al panel de favoritos
- **Gestión de cantidades** con botones + y - 
- **Eliminación de productos** individual
- **Cálculo automático** de subtotales y total
- **Persistencia** en el backend por usuario
- **Botón checkout** para proceder al pago
- **Sincronización en tiempo real** entre componentes

### **❤️ Sistema de Favoritos**
- **Drawer lateral** con overlay de fondo
- **Favoritos únicos por usuario** autenticado
- **Sincronización automática** entre componentes
- **Estado de stock** en tiempo real
- **Navegación directa** al detalle del producto
- **Eliminación individual** de favoritos

### **🔐 Autenticación y Usuario**
- **Login/Registro** solo con email y contraseña
- **Tokens JWT** con renovación automática
- **Avatar de usuario** con iniciales de colores
- **Dropdown de usuario** con opciones de navegación
- **Logout seguro** con notificaciones

## Estructura del Proyecto

### **Páginas Principales**
```
taller-maestro/src/pages/
├── HomePage.js              # Página principal con productos destacados
├── CatalogPage.js           # Catálogo completo con filtros
├── ProductDetailPage.js     # Detalle de producto individual
├── AboutUsPage.js           # Información de la empresa
├── ContactPage.js           # Formulario de contacto
├── LoginPage.js             # Inicio de sesión
├── RegisterPage.js          # Registro de usuario
└── TermsPage.js             # Términos y condiciones
```

### **Componentes Clave**
```
taller-maestro/src/components/
├── Navbar.js                # Navegación con carrito y favoritos
├── Footer.js                # Pie de página
├── ProductCard.js           # Tarjeta de producto
├── ProductsSection.js       # Sección de productos destacados
├── ProductSearch.js         # Búsqueda de productos
├── ProductFilter.js         # Filtros de catálogo
├── FeatureCards.js          # Cards de características
├── HeroSlider.js            # Carrusel principal
└── AuthLoader.js            # Loader de autenticación
```

### **Contextos y Servicios**
```
taller-maestro/src/
├── context/
│   ├── UserContext.js       # Estado global de usuario
│   └── CartContext.js       # Estado global del carrito
├── services/
│   ├── authService.js       # Servicios de autenticación
│   ├── cartService.js       # Servicios del carrito
│   ├── favoritesService.js  # Servicios de favoritos
│   └── productsService.js   # Servicios de productos
└── utils/
    └── authUtils.js         # Utilidades de autenticación
```

## Tecnologías Utilizadas

### **Frontend**
- React 17 + React Router DOM 6
- Axios para peticiones HTTP
- SweetAlert2 para notificaciones
- Font Awesome para iconos
- CSS personalizado responsive

### **Backend**
- Django 5.2+
- Django REST Framework 3.15+
- Django Simple JWT 5.3+
- Django CORS Headers 4.3+
- Pillow para manejo de imágenes

## Instalación y Configuración

### **Backend (Django)**
1. Navega al directorio del backend:
   ```bash
   cd taller-maestro-backend
   ```
2. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Realiza migraciones:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Crea un superusuario:
   ```bash
   python manage.py createsuperuser
   ```
5. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```

### **Frontend (React)**
1. Navega al directorio del frontend:
   ```bash
   cd taller-maestro
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta la aplicación:
   ```bash
   npm start
   ```

## Rutas Principales

**Principales páginas:**
- `/` - Página principal
- `/catalogo` - Catálogo de productos
- `/producto/:slug` - Detalle de producto
- `/login` - Inicio de sesión
- `/registro` - Registro de usuario
- `/quienes-somos` - Información de la empresa
- `/contacto` - Formulario de contacto
- `/terms` - Términos y condiciones
- `/historial-compras` - Historial (placeholder)

## Experiencia de Usuario

### **Navegación**
- **Header sticky** con navegación responsive
- **Menú hamburguesa** en dispositivos móviles
- **Breadcrumbs** y navegación intuitiva

### **Carrito y Favoritos**
- **Drawers laterales** con diseño consistente
- **Overlays semitransparentes** para mejor UX
- **Animaciones suaves** de deslizamiento
- **Feedback visual** inmediato en acciones

### **Autenticación**
- **Formularios simples** (solo email + contraseña)
- **Validación en tiempo real**
- **Notificaciones elegantes** con SweetAlert2
- **Renovación automática** de tokens

## Notas de Seguridad y Despliegue

- ✅ **HTTPS obligatorio** en producción
- ✅ **CORS configurado** correctamente
- ✅ **Tokens JWT** con expiración automática
- ✅ **Validación de datos** en frontend y backend
- ✅ **Sanitización** de inputs del usuario

## Próximas Características

- [ ] Pasarela de pagos
- [ ] Historial de compras funcional
- [ ] Sistema de reviews
- [ ] Notificaciones push
- [ ] Dashboard de administración

---

## Autores
- Equipo Taller del Maestro

## Licencia
Este proyecto es privado y confidencial.

## Contacto
Para soporte técnico o consultas sobre el proyecto, contacta al equipo de desarrollo.