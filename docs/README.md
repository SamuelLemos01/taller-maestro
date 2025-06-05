# Documentación Completa - Taller Maestro

## Índice General 📚

Este directorio contiene la documentación completa del proyecto **Taller Maestro**, un e-commerce especializado en herramientas y productos para talleres.

### Estructura de la Documentación

```
docs/
├── README.md                    # Este archivo - Índice general
├── backend/                     # Documentación del Backend (Django)
├── frontend/                    # Documentación del Frontend (React)
├── database/                    # Documentación de Base de Datos
├── apis/                        # Documentación de APIs y Endpoints
├── deployment/                  # Guías de Despliegue
├── examples/                    # Ejemplos de Uso
└── troubleshooting/            # Solución de Problemas
```

## Documentación por Categorías

### 🖥️ Backend (Django)
- **[Modelos de Datos](backend/models.md)** - Estructura de la base de datos
- **[Vistas y ViewSets](backend/views.md)** - Lógica de negocio del backend
- **[Serializers](backend/serializers.md)** - Serialización de datos
- **[Autenticación JWT](backend/authentication.md)** - Sistema de autenticación
- **[Configuración](backend/configuration.md)** - Settings y configuraciones

### ⚛️ Frontend (React)
- **[Componentes](frontend/components.md)** - Todos los componentes React
- **[Páginas](frontend/pages.md)** - Documentación de páginas principales
- **[Servicios](frontend/services.md)** - Servicios para comunicación con APIs
- **[Contexto y Estado](frontend/context.md)** - Manejo de estado global
- **[Utilidades](frontend/utils.md)** - Funciones auxiliares
- **[Estilos](frontend/styles.md)** - Documentación de CSS

### 🗄️ Base de Datos
- **[Esquema de BD](database/schema.md)** - Estructura completa de la base de datos
- **[Migraciones](database/migrations.md)** - Historial de migraciones
- **[Datos de Prueba](database/fixtures.md)** - Datos de ejemplo y fixtures

### 📡 APIs y Endpoints
- **[API Productos](apis/products.md)** - Endpoints de productos
- **[API Autenticación](apis/authentication.md)** - Endpoints de auth
- **[API Favoritos](apis/favorites.md)** - Endpoints de favoritos
- **[Códigos de Error](apis/error-codes.md)** - Códigos de error estándar

### 🚀 Despliegue
- **[Configuración Local](deployment/local-setup.md)** - Instalación en desarrollo
- **[Despliegue Producción](deployment/production.md)** - Despliegue en producción
- **[Variables de Entorno](deployment/environment.md)** - Configuración de variables

### 💡 Ejemplos
- **[Casos de Uso](examples/use-cases.md)** - Casos de uso comunes
- **[Flujos de Usuario](examples/user-flows.md)** - Flujos típicos del usuario
- **[Integración Frontend-Backend](examples/integration.md)** - Ejemplos de integración

### 🔧 Solución de Problemas
- **[Errores Comunes](troubleshooting/common-errors.md)** - Errores frecuentes y soluciones
- **[Problemas de Autenticación](troubleshooting/auth-issues.md)** - Issues con JWT y login
- **[Performance](troubleshooting/performance.md)** - Optimización y rendimiento

---

## Cómo Usar Esta Documentación

### Para Desarrolladores Nuevos
1. Comienza con **[Configuración Local](deployment/local-setup.md)**
2. Lee **[Esquema de BD](database/schema.md)** para entender la estructura
3. Revisa **[Casos de Uso](examples/use-cases.md)** para entender el flujo

### Para Modificar Componentes
1. Busca el componente en **[Componentes](frontend/components.md)**
2. Revisa las dependencias en **[Servicios](frontend/services.md)**
3. Consulta **[APIs](apis/)** para endpoints relacionados

### Para Agregar Funcionalidades
1. Define el modelo en **[Modelos](backend/models.md)**
2. Crea las vistas en **[Views](backend/views.md)**
3. Desarrolla el frontend siguiendo **[Componentes](frontend/components.md)**

---

## Convenciones de Documentación

### Formato de Archivos
- **Markdown** (.md) para toda la documentación
- **Código comentado** dentro de los archivos fuente
- **Ejemplos prácticos** en cada sección

### Estructura de Cada Documento
```markdown
# Título del Componente/Funcionalidad

## Descripción
Qué hace y para qué sirve

## Ubicación
Ruta del archivo en el proyecto

## Dependencias
Qué otros archivos/componentes necesita

## Props/Parámetros
Descripción de entradas

## Métodos/Funciones
Funciones principales

## Estados/Variables
Variables importantes

## Ejemplos de Uso
Código de ejemplo

## Notas Importantes
Consideraciones especiales
```

---

## Última Actualización
**Fecha:** $(date)
**Versión:** 1.0.0
**Estado:** ✅ Completa

---

## Contacto y Contribución

Para actualizar esta documentación:
1. Modifica el archivo correspondiente
2. Actualiza la fecha en este README
3. Commit con mensaje descriptivo: `docs: actualizar [componente]`

**Importante:** Mantén esta documentación actualizada con cada cambio significativo en el código. 