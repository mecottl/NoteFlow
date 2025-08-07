// Configuración de entorno para el frontend
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_VERCEL: process.env.VERCEL === '1'
};

// URLs de la API según el entorno
export const API_URLS = {
  DEVELOPMENT: 'http://localhost:3001/api',
  PRODUCTION: '/api'
};

// Función para obtener la URL base de la API
export function getApiBaseUrl() {
  if (ENV.IS_DEVELOPMENT) {
    return API_URLS.DEVELOPMENT;
  }
  return API_URLS.PRODUCTION;
}

export default {
  ENV,
  API_URLS,
  getApiBaseUrl
}; 