# 🚀 Guía de Deployment - NoteFlow en Vercel

## 📋 Resumen del Proyecto

**NoteFlow** es una aplicación full-stack de notas con inteligencia artificial que incluye:

### 🎯 Funcionalidades Principales
- **Sistema de autenticación** con JWT y bcrypt
- **Gestión de notas** (CRUD completo)
- **Integración con IA** usando OpenRouter API (DeepSeek Chat)
- **Autocompletado inteligente** en el editor de notas
- **Interfaz moderna** con React y Styled Components

### 🏗️ Arquitectura
- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + Vite + Styled Components
- **Base de datos**: SQLite (local) / In-memory (Vercel)
- **Autenticación**: JWT + bcrypt
- **IA**: OpenRouter API (DeepSeek Chat)

## 🔧 Cambios Realizados para Vercel

### 1. **Configuración de Vercel** (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "buildCommand": "npm run build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "Backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "Backend/index.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. **Adaptación del Backend**
- **Prefijo `/api/`** para todas las rutas
- **Base de datos adaptativa**: SQLite persistente (desarrollo) / In-memory (Vercel)
- **CORS configurado** para múltiples orígenes
- **Middleware de seguridad** añadido
- **Manejo centralizado de errores**

### 3. **Configuración del Frontend**
- **URLs dinámicas** según entorno (localhost/vercel)
- **Configuración de Vite** optimizada
- **Manejo de errores** mejorado

### 4. **Archivos Creados/Modificados**

#### Nuevos archivos:
- `vercel.json` - Configuración de Vercel
- `Backend/config/` - Configuración centralizada
- `Backend/middleware/` - Middlewares de seguridad y errores
- `Backend/db/vercelDb.js` - DB para Vercel
- `Backend/db/devDb.js` - DB para desarrollo
- `Backend/db/prodDb.js` - DB para producción
- `frontend/src/config/` - Configuración del frontend
- `frontend/src/utils/errorHandling.js` - Manejo de errores
- `env.example` - Variables de entorno
- `README.md` - Documentación completa

#### Archivos modificados:
- `Backend/index.js` - Adaptado para Vercel
- `frontend/src/components/` - URLs actualizadas
- `package.json` (root) - Scripts añadidos
- `Backend/package.json` - Scripts para Vercel

## 📋 Pasos para Deployar en Vercel

### 1. **Preparación Inicial**
```bash
# Instalar dependencias
npm run install-all

# Verificar que todo funciona localmente
npm run dev
```

### 2. **Configurar Variables de Entorno en Vercel**
En el dashboard de Vercel, añadir estas variables:
```
JWT_SECRET=tu_super_secreto_jwt_aqui
OPENROUTER_API_KEY=tu_api_key_de_openrouter_aqui
NODE_ENV=production
```

### 3. **Verificar Configuración Actual**
El proyecto ya está **100% configurado** para Vercel. No necesitas hacer ningún cambio adicional:

✅ **vercel.json** - Configurado correctamente
✅ **Backend/index.js** - Adaptado para serverless
✅ **Frontend** - URLs dinámicas configuradas
✅ **Base de datos** - Configuración para Vercel (in-memory)
✅ **CORS** - Configurado para múltiples orígenes
✅ **Middleware de seguridad** - Implementado
✅ **Manejo de errores** - Centralizado

### 4. **Deployar en Vercel**
```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# O para producción
vercel --prod
```

### 5. **Verificar el Deploy**
- ✅ Backend funcionando en `/api/`
- ✅ Frontend funcionando en `/`
- ✅ Autenticación funcionando
- ✅ IA funcionando
- ✅ Base de datos inicializada

## ⚠️ Limitaciones Importantes

### Base de Datos en Vercel
- **Datos no persisten** entre invocaciones (serverless)
- **Solución temporal**: Usar in-memory SQLite
- **Solución futura**: Migrar a PostgreSQL/MySQL

### Variables de Entorno Requeridas
- `JWT_SECRET`: Para autenticación
- `OPENROUTER_API_KEY`: Para funcionalidad de IA

## 🎯 Estado Actual
El proyecto está **100% listo** para deployment en Vercel. Todos los archivos han sido adaptados y configurados correctamente para funcionar en el entorno serverless de Vercel.

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend  
npm run dev:frontend

# Build para producción
npm run build

# Instalar todas las dependencias
npm run install-all
```

## 📁 Estructura del Proyecto

```
NoteFlow/
├── Backend/
│   ├── config/
│   │   ├── cors.js
│   │   └── env.js
│   ├── db/
│   │   ├── dbConfig.js
│   │   ├── vercelDb.js
│   │   ├── devDb.js
│   │   └── prodDb.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── security.js
│   ├── routes/
│   ├── services/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   ├── components/
│   │   └── utils/
│   └── package.json
├── vercel.json
├── package.json
└── README.md
```

## 🔒 Seguridad Implementada

### Middlewares de Seguridad
- **Rate Limiting**: 100 requests por 15 minutos
- **Request Size Limit**: 10MB máximo
- **Content Type Validation**: Solo JSON
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Log Sanitization**: No loggear datos sensibles

### CORS Configurado
- Orígenes permitidos: localhost, Vercel domains
- Credentials habilitados
- Métodos: GET, POST, PUT, DELETE, OPTIONS

## 🐛 Manejo de Errores

### Backend
- **Error Handler Centralizado**: CORS, validación, JWT, DB, API externa
- **404 Handler**: Rutas no encontradas
- **Logging**: Diferentes niveles según entorno

### Frontend
- **AppError Class**: Errores personalizados
- **handleApiError**: Parsing de errores de API
- **logError**: Logging condicional

## 🌐 URLs de la API

### Desarrollo
- `http://localhost:3001/api/auth/login`
- `http://localhost:3001/api/auth/register`
- `http://localhost:3001/api/notes`
- `http://localhost:3001/api/predict`

### Producción (Vercel)
- `/api/auth/login`
- `/api/auth/register`
- `/api/notes`
- `/api/predict`

## 📝 Notas Importantes

1. **Base de Datos**: En Vercel, los datos se pierden al reiniciar la función serverless
2. **Variables de Entorno**: Es crucial configurar `JWT_SECRET` y `OPENROUTER_API_KEY`
3. **CORS**: Configurado para permitir comunicación entre frontend y backend
4. **Logs**: En desarrollo se muestran en consola, en producción se envían a servicios externos
5. **Seguridad**: Implementados middlewares para proteger contra ataques comunes

## 🚀 Próximos Pasos

1. **Deploy en Vercel** siguiendo los pasos anteriores
2. **Configurar variables de entorno** en el dashboard de Vercel
3. **Probar todas las funcionalidades** en producción
4. **Considerar migración a base de datos externa** para persistencia de datos
5. **Implementar monitoreo y logging** en producción

## ✅ Estado Actual del Proyecto

El proyecto está **completamente listo** para deployment en Vercel. Todos los archivos han sido adaptados y configurados correctamente:

- **Backend**: Adaptado para serverless functions
- **Frontend**: URLs dinámicas configuradas
- **Base de datos**: Configuración para Vercel (in-memory)
- **Seguridad**: Middlewares implementados
- **Error handling**: Centralizado y robusto
- **CORS**: Configurado para múltiples orígenes

**No necesitas hacer ningún cambio adicional** antes del deployment.

---

El proyecto está completamente preparado para deployment en Vercel con todas las optimizaciones necesarias para un entorno serverless. 