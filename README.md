# El Taller del Maestro

## Índice
- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Backend (Django)](#backend-django)
- [Frontend (React)](#frontend-react)
- [Componentes Principales](#componentes-principales)
- [Notas de Seguridad](#notas-de-seguridad)

---

## Descripción

El Taller del Maestro es una plataforma web para la gestión y venta de productos personalizados. Incluye un backend en Django y un frontend en React, con autenticación de usuarios, gestión de productos, favoritos, carrito y más.

---

## Requisitos

- Python 3.9+
- Node.js 16+
- npm 8+
- (Recomendado) Virtualenv para Python

---

## Instalación

### 1. Clona el repositorio
```bash
git clone <URL_DEL_REPO>
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
│   │   └── ...
│   └── ...
└── README.md
```

---

## Backend (Django)

- **auth_user/**: Gestión de usuarios, registro, login, admin personalizado.
- **products/**: Gestión de productos, categorías, imágenes, stock, etc.
- **Endpoints principales:**
  - `POST /api/auth/signup/` — Registro de usuario
  - `POST /api/auth/login/` — Login seguro
  - `GET /api/v1/products/catalog/` — Listado de productos
  - `GET /api/v1/products/detail/<slug>/` — Detalle de producto

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

**Principales páginas:**
- `/login`: Inicio de sesión
- `/registro`: Registro de usuario
- `/catalogo`: Catálogo de productos
- `/producto/:slug`: Detalle de producto
- `/historial-compras`: (placeholder)
- `/terms`: Términos y condiciones

---

## Componentes Principales

### Navbar
- Muestra enlaces de navegación, carrito, usuario.
- Dropdown de usuario con avatar de color aleatorio, favoritos, historial, términos y cerrar sesión.
- Panel de favoritos tipo drawer, con productos favoritos, opción de eliminar y navegación al detalle.

### LoginPage / SignupPage
- Formularios validados, alertas bonitas (SweetAlert2), integración con backend.
- El login guarda el usuario en el contexto global (`UserContext`).

### ProductDetailPage
- Muestra detalles, imágenes, stock, botones de agregar al carrito y favoritos.
- Botones alineados y responsivos.

### UserContext
- Provee el usuario autenticado a toda la app.
- Permite login, logout y persistencia en localStorage.

---

## Notas de Seguridad
- Las contraseñas nunca se almacenan en texto plano.
- El backend usa hash seguro para contraseñas.
- El frontend nunca guarda la contraseña.
- Se recomienda usar HTTPS en producción.

---

## Contacto

Para dudas o soporte, contacta a los administradores del repositorio. 