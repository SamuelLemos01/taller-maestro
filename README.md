# El Taller del Maestro 🛠️

## Índice
- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Notas de Seguridad](#notas-de-seguridad)
- [Troubleshooting](#troubleshooting)

---

## Descripción

El Taller del Maestro es una plataforma web para la gestión y venta de productos personalizados. Incluye un backend en Django y un frontend en React, con autenticación de usuarios, gestión de productos, favoritos únicos por usuario, carrito y más.

## Características Principales

- **Catálogo de productos** con filtros y búsqueda avanzada
- **Carrito de compras** con drawer lateral y gestión de cantidades
- **Panel de favoritos** único por usuario (requiere autenticación)
- **Autenticación JWT** usando email (no username)
- **Seguridad reforzada**: expiración y rotación de tokens, blacklist, CORS seguro
- **Arquitectura full-stack**: Backend en Django + DRF, frontend en React
- **Diseño responsive** y experiencia de usuario moderna

## Arquitectura del Proyecto

### Frontend (React)
- **React 17** con React Router para navegación SPA
- **Axios** para comunicación HTTP con el backend
- **Context API** para manejo del estado global (usuario, carrito, favoritos)
- **SweetAlert2** para notificaciones y confirmaciones
- **Font Awesome** para iconografía
- **CSS personalizado** con diseño responsive

### Backend (Django REST Framework)
- **Django 5.2+** como framework principal
- **Django REST Framework** para APIs REST
- **JWT (Simple JWT)** para autenticación stateless
- **CORS Headers** para comunicación frontend-backend
- **SQLite** como base de datos (desarrollo)

## Requisitos

- **Python 3.9+**
- **Node.js 16+**
- **npm 8+**
- **(Recomendado) Virtualenv para Python**

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

## Estructura del Proyecto

```
taller-maestro/
├── taller-maestro-backend/   # Backend Django
│   ├── auth_user/            # App de usuarios
│   ├── products/             # App de productos
│   └── ...
├── taller-maestro/           # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Contextos globales
│   │   ├── services/        # Servicios API
│   │   ├── utils/           # Utilidades
│   │   └── ...
│   └── ...
└── README.md
```

## Funcionalidades Principales

### 🛒 Carrito de Compras
- **Drawer lateral** con diseño consistente al panel de favoritos
- **Gestión de cantidades** con botones + y - 
- **Eliminación de productos** individual
- **Cálculo automático** de subtotales y total
- **Persistencia** en el backend por usuario
- **Botón checkout** para proceder al pago
- **Sincronización en tiempo real** entre componentes

### ❤️ Sistema de Favoritos
- **Drawer lateral** con overlay de fondo
- **Favoritos únicos por usuario** autenticado
- **Sincronización automática** entre componentes
- **Estado de stock** en tiempo real
- **Navegación directa** al detalle del producto
- **Eliminación individual** de favoritos

### 🔐 Autenticación y Usuario
- **Login/Registro** solo con email y contraseña
- **Tokens JWT** con renovación automática
- **Avatar de usuario** con iniciales de colores
- **Dropdown de usuario** con opciones de navegación
- **Logout seguro** con notificaciones

## Notas de Seguridad
- Las contraseñas nunca se almacenan en texto plano
- El backend usa hash seguro para contraseñas
- El frontend nunca guarda la contraseña
- El token JWT se almacena solo en memoria/contexto y localStorage de forma segura
- **Sistema JWT robusto**: Access tokens de 30 min, refresh tokens de 1 día con renovación automática
- **Verificación de expiración**: Tokens se verifican antes de cada petición con margen de seguridad
- **Logout automático**: En caso de tokens expirados o errores de autenticación
- Se recomienda usar HTTPS en producción

## Troubleshooting

### Errores comunes con favoritos
- **401 Unauthorized:**
  - El usuario no está autenticado o el token JWT es inválido/expirado
  - Solución: El sistema maneja esto automáticamente con renovación de tokens
- **El botón de favoritos no se actualiza:**
  - Puede deberse a que el evento `favorites-updated` no se dispara o no se escucha
  - Solución: Asegúrarse de que tanto el Navbar como ProductDetailPage escuchan el evento

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

## Próximas Características

- [ ] Pasarela de pagos
- [ ] Historial de compras funcional
- [ ] Sistema de reviews
- [ ] Notificaciones push
- [ ] Dashboard de administración

---

## Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: add nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## Contacto

Para dudas o soporte, contacta a los administradores del repositorio. 