# El Taller del Maestro 🛠️

## Índice
- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Backend (Django)](#backend-django)
- [Frontend (React)](#frontend-react)
- [Favoritos: Integración y Sincronización](#favoritos-integración-y-sincronización)
- [Componentes Principales](#componentes-principales)
- [Notas de Seguridad](#notas-de-seguridad)
- [Documentación Completa](#documentación-completa)
- [Troubleshooting](#troubleshooting)

---

## Descripción

El Taller del Maestro es una plataforma web para la gestión y venta de productos personalizados. Incluye un backend en Django y un frontend en React, con autenticación de usuarios, gestión de productos, favoritos únicos por usuario, carrito y más.

---

## Requisitos

- **Python 3.9+**
- **Node.js 16+**
- **npm 8+**
- **(Recomendado) Virtualenv para Python**

---

## Instalación

### 1. Clona el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd taller-maestro
```

### 2. Backend (Django)

```bash
cd taller-maestro-backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # (opcional, para admin)
python manage.py runserver
```

- El backend corre por defecto en `http://localhost:8000`
- La API principal está en `/api/v1/products/` y `/api/auth/`

### 3. Frontend (React)

```bash
cd ../taller-maestro
npm install
npm start
```

- El frontend corre por defecto en `http://localhost:3000`

---

## Estructura del Proyecto

```
taller-maestro/
├── taller-maestro-backend/   # Backend Django
│   ├── auth_user/            # App de usuarios
│   ├── products/             # App de productos
│   └── ...
├── taller-maestro/           # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (Navbar, Footer, etc)
│   │   ├── pages/            # Páginas principales (Login, Signup, ProductDetail, etc)
│   │   ├── context/          # Contextos globales (UserContext)
│   │   ├── services/         # Servicios API (favoritesService, etc)
│   │   ├── utils/            # Utilidades (authUtils, etc)
│   │   └── ...
│   └── ...
├── docs/                     # Documentación completa del proyecto
└── README.md
```

---

## Backend (Django)

- **auth_user/**: Gestión de usuarios, registro, login, admin personalizado.
- **products/**: Gestión de productos, categorías, imágenes, stock, favoritos.
- **Endpoints principales:**
  - `POST /api/auth/signup/` — Registro de usuario (solo email, no username)
  - `POST /api/auth/login/` — Login seguro con JWT (solo email)
  - `GET /api/v1/products/catalog/` — Listado de productos
  - `GET /api/v1/products/detail/<slug>/` — Detalle de producto
  - `GET/POST/DELETE /api/v1/products/favorites/` — Gestión de favoritos por usuario

**Favoritos:**
- Cada usuario tiene su propia lista de favoritos, almacenada en el backend.
- No se pueden duplicar productos en favoritos para un mismo usuario.
- El modelo Favorite está relacionado con usuario y producto, y es único por par usuario-producto.

**Configuración de CORS:**
- Permite peticiones desde `localhost:3000` para desarrollo.

**Admin:**
- Acceso en `/admin/` con el superusuario creado.

---

## Frontend (React)

- **Instalación:** ver arriba.
- **Estructura:**
  - `src/components/`: Navbar, Footer, etc.
  - `src/pages/`: LoginPage, SignupPage, ProductDetailPage, etc.
  - `src/context/UserContext.js`: Manejo global de usuario autenticado.
  - `src/services/favoritesService.js`: Lógica para consumir la API de favoritos con JWT.
  - `src/utils/authUtils.js`: Sistema completo de autenticación JWT con renovación automática.

**Principales páginas:**
- `/login`: Inicio de sesión (solo email y contraseña)
- `/registro`: Registro de usuario
- `/catalogo`: Catálogo de productos
- `/producto/:slug`: Detalle de producto
- `/historial-compras`: (placeholder)
- `/terms`: Términos y condiciones

---

## Favoritos: Integración y Sincronización

- Los favoritos son únicos por usuario y se gestionan completamente desde el backend.
- El panel de favoritos (drawer en el Navbar) muestra los productos favoritos del usuario autenticado.
- Puedes agregar o eliminar productos de favoritos desde cualquier parte de la app:
  - **Agregar:** Desde la página de detalle de producto, el botón "Agregar a Favoritos" se deshabilita y cambia a "Ya en Favoritos" si el producto ya está en la lista.
  - **Eliminar:** Desde el panel de favoritos, puedes quitar productos y el botón en el detalle se habilita automáticamente.
- **Sincronización en tiempo real:**
  - Se usa un evento global (`favorites-updated`) para que todos los componentes que muestran favoritos se actualicen al instante, sin recargar la página.
  - El estado de favoritos se consulta y sincroniza automáticamente al agregar o eliminar productos.
- **Autenticación JWT:**
  - Todas las operaciones de favoritos requieren que el usuario esté autenticado y se envía el token JWT en cada petición.
  - El login y registro solo requieren email y contraseña (no username).
  - **Sistema de renovación automática**: Los tokens se renuevan automáticamente sin intervención del usuario.

---

## Componentes Principales

### Navbar
- Muestra enlaces de navegación, carrito, usuario.
- Dropdown de usuario con avatar de color aleatorio, favoritos, historial, términos y cerrar sesión.
- Panel de favoritos tipo drawer, con productos favoritos, opción de eliminar y navegación al detalle.
- Sincronización en tiempo real con el resto de la app.

### LoginPage / SignupPage
- Formularios validados, alertas bonitas (SweetAlert2), integración con backend.
- El login guarda el usuario y el token JWT en el contexto global (`UserContext`).

### ProductDetailPage
- Muestra detalles, imágenes, stock, botones de agregar al carrito y favoritos.
- El botón de favoritos se deshabilita si el producto ya está en favoritos y se reactiva si se elimina.
- Sincronización en tiempo real con el panel de favoritos.

### UserContext
- Provee el usuario autenticado y el token JWT a toda la app.
- Permite login, logout y persistencia en localStorage.
- **Verificación automática de tokens** al inicializar la aplicación.

### AuthLoader
- Componente que muestra un spinner mientras se verifica el estado de autenticación inicial.
- Evita parpadeos y problemas de renderizado durante la carga.

---

## Notas de Seguridad
- Las contraseñas nunca se almacenan en texto plano.
- El backend usa hash seguro para contraseñas.
- El frontend nunca guarda la contraseña.
- El token JWT se almacena solo en memoria/contexto y localStorage de forma segura.
- **Sistema JWT robusto**: Access tokens de 30 min, refresh tokens de 1 día con renovación automática.
- **Verificación de expiración**: Tokens se verifican antes de cada petición con margen de seguridad.
- **Logout automático**: En caso de tokens expirados o errores de autenticación.
- Se recomienda usar HTTPS en producción.

---

## Documentación Completa 📚

Para información detallada sobre desarrollo, APIs, componentes y configuración:

**📖 [Ver Documentación Completa](./docs/README.md)**

La documentación incluye:
- 🔧 [Configuración Local Detallada](./docs/deployment/local-setup.md)
- 🗄️ [Modelos de Backend](./docs/backend/models.md)
- 🖥️ [Vistas y ViewSets](./docs/backend/views.md)
- ⚛️ [Componentes React](./docs/frontend/components.md)  
- 📡 [API Endpoints](./docs/apis/products.md)
- 🔐 [Sistema de Autenticación](./docs/frontend/utils.md)

---

## Troubleshooting

### Errores comunes con favoritos
- **401 Unauthorized:**
  - El usuario no está autenticado o el token JWT es inválido/expirado.
  - Solución: El sistema maneja esto automáticamente con renovación de tokens. Si persiste, revisar el flujo de login.
- **El botón de favoritos no se actualiza:**
  - Puede deberse a que el evento `favorites-updated` no se dispara o no se escucha en algún componente.
  - Solución: Asegúrate de que tanto el Navbar como ProductDetailPage escuchan el evento y recargan los favoritos.
- **No se ven productos en favoritos tras registrarse:**
  - El usuario debe estar autenticado y el token debe estar disponible en el contexto.

### Errores comunes de instalación

#### Error: "Port already in use"
```bash
# Matar proceso en puerto 8000
sudo lsof -ti:8000 | xargs kill -9

# Matar proceso en puerto 3000  
sudo lsof -ti:3000 | xargs kill -9
```

#### Error: "Module not found" 
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

#### Error: CORS en desarrollo
Verificar que en `taller-maestro-backend/tallerBackend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Más problemas?
Consulta la [Documentación de Troubleshooting](./docs/deployment/local-setup.md#-solución-de-problemas-comunes) para más detalles.

---

## Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: add nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## Contacto

Para dudas o soporte, contacta a los administradores del repositorio. 