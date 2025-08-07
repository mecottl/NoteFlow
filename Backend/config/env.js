// Configuración de variables de entorno
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const config = {
  // Entorno
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_VERCEL: process.env.VERCEL === '1',
  
  // Servidor
  PORT: process.env.PORT || 3001,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'mi_super_secreto',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2d',
  
  // OpenRouter API
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free',
  
  // Base de datos
  DB_TYPE: process.env.DB_TYPE || 'sqlite',
  DB_URL: process.env.DB_URL,
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://noteflow.vercel.app'
      ]
};

// Validar variables críticas
const validateConfig = () => {
  const errors = [];
  
  if (!config.JWT_SECRET || config.JWT_SECRET === 'mi_super_secreto') {
    errors.push('JWT_SECRET debe ser configurado en producción');
  }
  
  if (!config.OPENROUTER_API_KEY) {
    errors.push('OPENROUTER_API_KEY es requerido para la funcionalidad de IA');
  }
  
  if (config.IS_PRODUCTION && errors.length > 0) {
    console.error('❌ Errores de configuración:', errors);
    throw new Error('Configuración inválida para producción');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Advertencias de configuración:', errors);
  }
};

// Validar en startup
validateConfig();

export default config; 