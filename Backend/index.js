// index.js
// --- NOTA: Código limpio, uso de import/export, preparado para agregar middlewares de auth en el futuro ---

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import predictRoute from './routes/predict.js';
import notesRoute from './routes/notes.js';
import authRoutes from './routes/authRoutes.js';
import { initDatabase } from './db/initDb.js';
import corsMiddleware from './config/cors.js';
import config from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { 
  requestSizeLimit, 
  validateContentType, 
  rateLimit, 
  securityHeaders, 
  sanitizeLogs 
} from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MODIFICACIÓN: CORS configurado para producción y desarrollo ---
app.use(corsMiddleware);

// Middlewares de seguridad
app.use(securityHeaders);
app.use(requestSizeLimit);
app.use(validateContentType);
app.use(rateLimit);
app.use(sanitizeLogs);

app.use(express.json());

// --- NOTA: Rutas organizadas y fáciles de mantener ---
app.use('/api/auth', authRoutes);       // Rutas de autenticación
app.use('/api/predict', predictRoute);  // Rutas de IA/predicción
app.use('/api/notes', notesRoute);      // Rutas CRUD de notas

// --- MODIFICACIÓN: Ruta base para saber si el backend está vivo (útil para pruebas) ---
app.get('/api', (req, res) => {
  res.json({ message: '🧠 NoteFlow backend corriendo!', status: 'ok' });
});

// --- MODIFICACIÓN: Servir archivos estáticos del frontend en producción ---
if (config.IS_PRODUCTION) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // ✅ Rutas estáticas para React; no confunde el '*' con un parámetro
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(notFoundHandler);
app.use(errorHandler);

// --- NOTA: Puerto definido por variable de entorno o default ---
const PORT = config.PORT;

// Inicializar base de datos siempre en desarrollo
console.log('🔍 Inicializando base de datos...');
initDatabase().then(() => {
  console.log('✅ Base de datos inicializada');
}).catch((error) => {
  console.error('❌ Error inicializando base de datos:', error);
});

// Solo iniciar servidor si no estamos en Vercel
if (!config.IS_PRODUCTION || !config.IS_VERCEL) {
  app.listen(PORT, () => {
    console.log(`🧠 NoteFlow backend corriendo en http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${config.NODE_ENV}`);
    console.log(`🔧 Vercel: ${config.IS_VERCEL ? 'Sí' : 'No'}`);
  });
}

export default app;
