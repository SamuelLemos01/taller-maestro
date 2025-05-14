# Taller del Maestro

## Descripción
Tienda online de productos artesanales con panel de favoritos por usuario y autenticación segura con JWT (login por email).

## Características principales
- Catálogo de productos con filtros y búsqueda.
- Panel de favoritos único por usuario (requiere autenticación).
- Autenticación JWT usando email (no username).
- Seguridad reforzada: expiración y rotación de tokens, blacklist, CORS seguro.
- Backend en Django + DRF, frontend en React.

## Estructura del Proyecto

### Páginas
- HomePage.js - Página principal
- HomePage.css - Estilos de la página principal
- CatalogPage.js - Página del catálogo de productos
- CatalogPage.css - Estilos del catálogo
- AboutUsPage.js - Página de información sobre la empresa
- AboutUsPage.css - Estilos de la página de información
- ContactPage.js - Página de contacto
- ContactPage.css - Estilos de la página de contacto
- LoginPage.js - Página de inicio de sesión
- LoginPage.css - Estilos de la página de inicio de sesión
- RegisterPage.js - Página de registro
- RegisterPage.css - Estilos de la página de registro

### Componentes
- Navbar.js - Barra de navegación
- Footer.js - Pie de página
- ProductCard.js - Tarjeta de producto
- ProductsSection.js - Sección de productos destacados
- ServiceCard.js - Tarjeta de servicio
- ServicesSection.js - Sección de servicios
- ContactForm.js - Formulario de contacto
- LoginForm.js - Formulario de inicio de sesión
- RegisterForm.js - Formulario de registro

## Tecnologías Utilizadas
- React.js
- React Router
- CSS
- Font Awesome
- Google Fonts

## Instalación

### Backend
1. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```
2. Realiza migraciones y crea un superusuario:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```
3. Ejecuta el servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta la app:
   ```bash
   npm start
   ```

## Notas de seguridad
- Usa HTTPS en producción.
- Configura correctamente CORS y los tokens en el frontend.
- Haz commits frecuentes para evitar pérdida de trabajo.

---

## Autores
- Equipo Taller del Maestro

## Descripción de los Componentes

### HomePage.js
Página principal que muestra una vista general del taller, productos destacados y servicios.

### HomePage.css
Estilos para la página principal, incluyendo el diseño responsive y animaciones.

### CatalogPage.js
Página que muestra el catálogo completo de productos disponibles.

### CatalogPage.css
Estilos para la página de catálogo, incluyendo grid de productos y filtros.

### AboutUsPage.js
Página con información sobre la historia, misión y visión del taller.

### AboutUsPage.css
Estilos para la página de información sobre la empresa.

### ContactPage.js
Página con formulario de contacto y información de ubicación.

### ContactPage.css
Estilos para la página de contacto, incluyendo el formulario y el mapa.

### LoginPage.js
Página de inicio de sesión para usuarios registrados.

### LoginPage.css
Estilos para la página de inicio de sesión.

### RegisterPage.js
Página de registro para nuevos usuarios.

### RegisterPage.css
Estilos para la página de registro.

### Navbar.js
Componente de navegación principal con menú responsive.

### Footer.js
Componente de pie de página con información de contacto y enlaces.

### ProductCard.js
Componente para mostrar información individual de productos.

### ProductsSection.js
Componente que muestra una sección de productos destacados.

### ServiceCard.js
Componente para mostrar información individual de servicios.

### ServicesSection.js
Componente que muestra una sección de servicios ofrecidos.

### ContactForm.js
Componente de formulario para enviar mensajes de contacto.

### LoginForm.js
Componente de formulario para iniciar sesión.

### RegisterForm.js
Componente de formulario para registrar nuevos usuarios.