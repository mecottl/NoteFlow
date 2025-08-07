// Configuración de CORS para diferentes entornos
import cors from 'cors';

const isDevelopment = process.env.NODE_ENV === 'development';
const isVercel = process.env.VERCEL === '1';

// Orígenes permitidos
const allowedOrigins = [
  // Desarrollo
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  
  // Producción - Vercel
  'https://noteflow.vercel.app',
  'https://noteflow-git-main.vercel.app',
  'https://noteflow-git-develop.vercel.app',
  
  // Dominios personalizados (agregar según necesidad)
  // 'https://tu-dominio.com',
];

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origin está permitido
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin no permitido: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Para legacy browsers
};

export default cors(corsOptions); 