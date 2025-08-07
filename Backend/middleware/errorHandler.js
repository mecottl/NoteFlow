// Middleware para manejo de errores
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Error de CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS: Origin no permitido',
      message: 'El origen de la petición no está autorizado'
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }

  // Error de autenticación
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token de autenticación no es válido'
    });
  }

  // Error de base de datos
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Error de base de datos',
      message: 'Datos duplicados o inválidos'
    });
  }

  // Error de API externa
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Servicio no disponible',
      message: 'El servicio de IA no está disponible'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
}

// Middleware para manejar rutas no encontradas
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.path} no existe`
  });
} 