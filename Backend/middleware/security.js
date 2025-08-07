// Middleware de seguridad
import config from '../config/env.js';

// Middleware para limitar el tamaño de las peticiones
export function requestSizeLimit(req, res, next) {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Payload too large',
      message: 'El tamaño de la petición excede el límite permitido'
    });
  }
  
  next();
}

// Middleware para validar tipos de contenido
export function validateContentType(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Invalid content type',
        message: 'El tipo de contenido debe ser application/json'
      });
    }
  }
  
  next();
}

// Middleware para rate limiting básico
const requestCounts = new Map();

export function rateLimit(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 100; // 100 requests por ventana
  
  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + windowMs });
  } else {
    const client = requestCounts.get(clientIP);
    
    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowMs;
    } else {
      client.count++;
      
      if (client.count > maxRequests) {
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Has excedido el límite de peticiones'
        });
      }
    }
  }
  
  next();
}

// Middleware para headers de seguridad
export function securityHeaders(req, res, next) {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy básico
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
}

// Limpiar datos sensibles de los logs
export function sanitizeLogs(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // No loggear datos sensibles
    if (req.path.includes('/auth') && req.method === 'POST') {
      console.log(`${req.method} ${req.path} - [SENSITIVE DATA]`);
    } else {
      console.log(`${req.method} ${req.path} - ${res.statusCode}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
} 