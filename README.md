# 🧠 NoteFlow

Una aplicación de notas moderna con **inteligencia artificial predictiva** que mejora tu experiencia de escritura.

## ✨ Características

- 📝 **Gestión completa de notas** - Crear, editar, eliminar y organizar notas
- 🤖 **IA Predictiva** - Autocompletado inteligente mientras escribes
- 🔐 **Autenticación segura** - Sistema de registro/login con JWT
- 📱 **Diseño responsive** - Funciona perfectamente en móvil y desktop
- ⚡ **Tiempo real** - Sugerencias de IA instantáneas
- 🎨 **UI moderna** - Interfaz limpia y intuitiva

## 🚀 Despliegue en Vercel

### 1. Preparación

1. **Fork o clona** este repositorio
2. **Configura las variables de entorno** en Vercel:
   - `JWT_SECRET`: Tu secreto JWT para autenticación
   - `OPENROUTER_API_KEY`: Tu API key de OpenRouter para la IA

### 2. Despliegue

1. Ve a [Vercel](https://vercel.com)
2. **Importa tu repositorio** de GitHub
3. **Configura las variables de entorno** en la pestaña Settings > Environment Variables
4. **Deploy** - ¡Listo!

### 3. Variables de Entorno Requeridas

```bash
JWT_SECRET=tu_super_secreto_jwt_aqui
OPENROUTER_API_KEY=tu_api_key_de_openrouter_aqui
```

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd NoteFlow

# Instalar dependencias
npm run install-all

# Configurar variables de entorno
cp env.example .env
# Edita .env con tus valores
```

### Ejecutar

```bash
# Backend (puerto 3001)
cd Backend
npm start

# Frontend (puerto 5173)
cd frontend
npm run dev
```

## 🏗️ Arquitectura

- **Frontend**: React + Vite + Styled Components
- **Backend**: Node.js + Express + SQLite
- **Base de datos**: SQLite (archivo local)
- **IA**: OpenRouter API (DeepSeek Chat)
- **Autenticación**: JWT + bcrypt

## 📁 Estructura del Proyecto

```
NoteFlow/
├── Backend/           # API REST
│   ├── routes/       # Rutas de la API
│   ├── services/     # Servicios (IA)
│   ├── db/          # Base de datos SQLite
│   └── index.js     # Servidor Express
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── config/   # Configuración de API
│   │   └── styles/
│   └── package.json
├── vercel.json      # Configuración de Vercel
└── README.md
```

## 🔧 Configuración de IA

La aplicación usa **OpenRouter API** para las predicciones de IA:

1. Regístrate en [OpenRouter](https://openrouter.ai)
2. Obtén tu API key
3. Configúrala como variable de entorno `OPENROUTER_API_KEY`

## 🎯 Uso

1. **Regístrate** o **inicia sesión**
2. **Crea una nueva nota** o selecciona una existente
3. **Escribe** y observa las sugerencias de IA en gris
4. **Presiona Tab** para aceptar sugerencias
5. **Guarda** tus notas automáticamente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [OpenRouter](https://openrouter.ai) por la API de IA
- [Vercel](https://vercel.com) por el hosting
- [React](https://reactjs.org) por el framework
- [Express](https://expressjs.com) por el servidor 