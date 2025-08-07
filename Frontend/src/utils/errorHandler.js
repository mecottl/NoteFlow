// Utilidad para manejo de errores en producción
export class AppError extends Error {
  constructor(message, status = 500, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(error, context = '') {
  console.error(`Error en ${context}:`, error);
  
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    };
  }
  
  // Error de red
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      message: 'Error de conexión. Verifica tu conexión a internet.',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }
  
  // Error de servidor
  if (error.response) {
    return {
      message: error.response.data?.error || 'Error del servidor',
      status: error.response.status,
      code: 'SERVER_ERROR'
    };
  }
  
  return {
    message: 'Error inesperado',
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
}

export function logError(error, context = '') {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}] Error:`, error);
  }
  // En producción, podrías enviar el error a un servicio de logging
} 