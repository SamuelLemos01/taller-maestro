# Configuración Local - Guía de Instalación

## Descripción General
Esta guía te ayudará a configurar el proyecto Taller Maestro en tu entorno local de desarrollo. Incluye tanto el backend (Django) como el frontend (React).

---

## ⚙️ Requisitos Previos

### Herramientas Necesarias

| Herramienta | Versión Requerida | Propósito | Link de Descarga |
|-------------|-------------------|-----------|------------------|
| **Python** | 3.8+ | Backend Django | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 16+ | Frontend React | [nodejs.org](https://nodejs.org/download/) |
| **Git** | Cualquier versión reciente | Control de versiones | [git-scm.com](https://git-scm.com/downloads/) |
| **SQLite** | Incluido con Python | Base de datos (desarrollo) | N/A |

### Verificar Instalaciones
```bash
# Verificar Python
python --version
# Debería mostrar: Python 3.8.x o superior

# Verificar Node.js
node --version
# Debería mostrar: v16.x.x o superior

# Verificar npm
npm --version
# Debería mostrar: 8.x.x o superior

# Verificar Git
git --version
# Debería mostrar: git version 2.x.x
```

---

## 📥 Clonar el Repositorio

### Paso 1: Clonar el Proyecto
```bash
# Clonar el repositorio (ajustar URL según tu repo)
git clone https://github.com/tu-usuario/taller-maestro.git

# Entrar al directorio del proyecto
cd taller-maestro

# Verificar estructura
ls -la
# Deberías ver: taller-maestro/ taller-maestro-backend/ docs/ README.md
```

### Estructura del Proyecto
```
taller-maestro/
├── taller-maestro/              # Frontend React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── taller-maestro-backend/      # Backend Django
│   ├── tallerBackend/
│   ├── products/
│   ├── auth_user/
│   ├── manage.py
│   └── requirements.txt
├── docs/                        # Documentación
└── README.md
```

---

## 🐍 Configuración del Backend (Django)

### Paso 1: Crear Entorno Virtual
```bash
# Navegar al directorio del backend
cd taller-maestro-backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate

# Verificar que está activado (debería mostrar (venv) al inicio)
which python
```

### Paso 2: Instalar Dependencias
```bash
# Instalar dependencias desde requirements.txt
pip install -r requirements.txt

# Verificar instalación
pip list
# Deberías ver: Django, djangorestframework, django-cors-headers, etc.
```

### Dependencias Principales
- **Django** (5.2+): Framework web principal
- **djangorestframework** (3.15.1+): API REST
- **djangorestframework-simplejwt** (5.3.1+): Autenticación JWT
- **django-cors-headers** (4.3.1+): Manejo de CORS
- **Pillow** (11.2.1): Procesamiento de imágenes

### Paso 3: Configurar Base de Datos
```bash
# Aplicar migraciones existentes
python manage.py migrate

# Crear superusuario para el admin
python manage.py createsuperuser
# Seguir las instrucciones en pantalla
```

### Paso 4: Cargar Datos de Prueba (Opcional)
```bash
# Entrar al shell de Django
python manage.py shell

# Ejecutar en el shell:
from auth_user.models import User
from products.models import Category, Product

# Crear categorías de ejemplo
cat1 = Category.objects.create(
    name="Herramientas Eléctricas",
    description="Taladros, sierras, lijadoras y más"
)

cat2 = Category.objects.create(
    name="Herramientas Manuales", 
    description="Martillos, destornilladores, llaves"
)

# Crear productos de ejemplo
Product.objects.create(
    name="Taladro Black & Decker 500W",
    slug="taladro-black-decker-500w",
    description="Taladro eléctrico de 500W con mandril de 1/2 pulgada",
    price=85000,
    stock=15,
    category=cat1,
    is_featured=True,
    is_new=True
)

Product.objects.create(
    name="Martillo de Carpintero Stanley",
    slug="martillo-carpintero-stanley", 
    description="Martillo de 16 oz con mango ergonómico",
    price=45000,
    stock=25,
    category=cat2,
    is_featured=False,
    is_new=True
)

# Salir del shell
exit()
```

### Paso 5: Iniciar Servidor de Desarrollo
```bash
# Iniciar servidor Django
python manage.py runserver

# El servidor estará disponible en:
# http://localhost:8000/

# Panel de administración:
# http://localhost:8000/admin/
```

### Verificar Backend
Prueba estos URLs en tu navegador:
- **Admin**: `http://localhost:8000/admin/` (usar superusuario creado)
- **API Productos**: `http://localhost:8000/api/v1/products/catalog/`
- **API Categorías**: `http://localhost:8000/api/v1/products/categories/`

---

## ⚛️ Configuración del Frontend (React)

### Paso 1: Instalar Dependencias
```bash
# Abrir una nueva terminal (mantener backend corriendo)
# Navegar al directorio del frontend
cd taller-maestro

# Instalar dependencias
npm install

# Verificar package.json
cat package.json
```

### Dependencias Principales
- **React** (18+): Framework frontend
- **React Router DOM**: Navegación SPA
- **Axios**: Cliente HTTP para APIs
- **SweetAlert2**: Modales y alertas
- **Font Awesome**: Iconos

### Paso 2: Verificar Configuración
```bash
# Revisar variables de entorno (si existen)
cat .env
# Si no existe, crear .env con:
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

### Paso 3: Iniciar Servidor de Desarrollo
```bash
# Iniciar servidor React
npm start

# El servidor estará disponible en:
# http://localhost:3000/
# Debería abrir automáticamente en el navegador
```

### Verificar Frontend
La aplicación debería:
1. **Cargar correctamente** en `http://localhost:3000/`
2. **Mostrar productos** en la página de inicio
3. **Permitir navegación** entre páginas
4. **Conectar con el backend** (verificar Network tab en DevTools)

---

## 🔍 Verificación Completa

### Checklist de Funcionalidades

#### Backend ✅
- [ ] Servidor Django corriendo en puerto 8000
- [ ] Admin panel accesible con superusuario
- [ ] API endpoints responden correctamente
- [ ] Base de datos con datos de ejemplo

#### Frontend ✅  
- [ ] Servidor React corriendo en puerto 3000
- [ ] Página de inicio carga productos
- [ ] Navegación entre páginas funciona
- [ ] Registro e inicio de sesión funcionan

#### Integración ✅
- [ ] Frontend se conecta correctamente al backend
- [ ] Sistema de autenticación JWT funciona
- [ ] Favoritos se pueden agregar/eliminar
- [ ] No hay errores de CORS

### Prueba de Flujo Completo
1. **Registrar nuevo usuario** en `/registro`
2. **Iniciar sesión** en `/login`
3. **Ver productos** en catálogo
4. **Agregar favorito** en detalle de producto
5. **Ver favoritos** en dropdown de usuario

---

## 🚨 Solución de Problemas Comunes

### Error: "Module not found"
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Error: "Port already in use"
```bash
# Encontrar proceso usando el puerto
# En Windows:
netstat -ano | findstr :8000

# En macOS/Linux:
lsof -i :8000

# Matar proceso (reemplazar PID)
kill -9 <PID>
```

### Error: CORS en Frontend
Verificar en `taller-maestro-backend/tallerBackend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Debe incluir el puerto del frontend
]
```

### Error: "No such table" en Django
```bash
# Eliminar base de datos y recrear
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Error: JWT Token Invalid
```bash
# Limpiar localStorage en el navegador
# Abrir DevTools > Application > Local Storage > Clear All
```

---

## 📱 Configuración para Móvil (Opcional)

### Acceder desde Dispositivo Móvil
```bash
# Encontrar IP local
# En Windows:
ipconfig

# En macOS/Linux:
ifconfig

# Usar IP en lugar de localhost
# Ejemplo: http://192.168.1.100:3000
```

### Actualizar CORS para IP Local
En `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.1.100:3000",  # Agregar tu IP local
]
```

---

## 🛠️ Herramientas de Desarrollo Recomendadas

### Editor de Código
- **Visual Studio Code** con extensiones:
  - Python
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - GitLens

### Extensiones de Navegador
- **React Developer Tools**
- **Redux DevTools** (si se implementa Redux)
- **JSON Viewer**

### Herramientas de Base de Datos
- **DB Browser for SQLite**: Para ver/editar base de datos
- **Postman**: Para probar APIs manualmente

---

## 📊 Comandos Útiles para Desarrollo

### Backend (Django)
```bash
# Crear nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Acceder al shell
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Recopilar archivos estáticos (para producción)
python manage.py collectstatic
```

### Frontend (React)
```bash
# Instalar nueva dependencia
npm install <package-name>

# Ejecutar tests
npm test

# Generar build de producción
npm run build

# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update
```

### Git
```bash
# Estado actual
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push
git push origin main

# Pull cambios remotos
git pull origin main
```

---

## 🎯 Próximos Pasos

Una vez que tengas todo funcionando localmente:

1. **Explorar el código**: Revisa la estructura y funcionamiento
2. **Leer la documentación**: Especialmente [Componentes](../frontend/components.md) y [APIs](../apis/)
3. **Hacer cambios pequeños**: Experimenta con modificaciones menores
4. **Ejecutar tests**: Asegúrate de que todo funciona correctamente
5. **Contribuir**: Sigue las guías de contribución del proyecto

### Recursos Adicionales
- **[Documentación de Django](https://docs.djangoproject.com/)**
- **[Documentación de React](https://react.dev/)**
- **[Django REST Framework](https://www.django-rest-framework.org/)**
- **[React Router](https://reactrouter.com/)**

---

## 📞 Ayuda y Soporte

Si tienes problemas:
1. **Revisa los logs** en terminal/consola
2. **Consulta esta documentación** y troubleshooting
3. **Busca en issues** del repositorio
4. **Crea un nuevo issue** con detalles del problema

¡Listo! Ya tienes el entorno de desarrollo configurado. 🚀 