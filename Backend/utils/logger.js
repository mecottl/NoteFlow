// Utilidad para logging
import config from '../config/env.js';

const isDevelopment = config.IS_DEVELOPMENT;

export const logger = {
  info: (message, data = {}) => {
    const log = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      data
    };
    
    if (isDevelopment) {
      console.log('ℹ️', message, data);
    } else {
      // En producción, podrías enviar a un servicio de logging
      console.log(JSON.stringify(log));
    }
  },

  error: (message, error = null) => {
    const log = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null
    };
    
    if (isDevelopment) {
      console.error('❌', message, error);
    } else {
      // En producción, podrías enviar a un servicio de logging
      console.error(JSON.stringify(log));
    }
  },

  warn: (message, data = {}) => {
    const log = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      data
    };
    
    if (isDevelopment) {
      console.warn('⚠️', message, data);
    } else {
      // En producción, podrías enviar a un servicio de logging
      console.warn(JSON.stringify(log));
    }
  },

  debug: (message, data = {}) => {
    if (isDevelopment) {
      console.debug('🐛', message, data);
    }
  }
};

export default logger; 