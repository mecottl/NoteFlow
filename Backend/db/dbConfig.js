// Configuración de base de datos para diferentes entornos
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb as getVercelDb } from './vercelDb.js';
import { getDevDb } from './devDb.js';
import { getProdDb } from './prodDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración según el entorno
const isVercel = process.env.VERCEL === '1';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV === 'production' && !isVercel;

// En Vercel, usar configuración específica para serverless
// En desarrollo, usar archivo SQLite
// En el futuro, se puede migrar a PostgreSQL o similar
const getDbConfig = () => {
  if (isVercel) {
    // En Vercel, usar la configuración específica
    return null; // Se maneja en vercelDb.js
  }
  
  if (isDevelopment) {
    return {
      filename: path.join(__dirname, 'NoteFlow.sqlite'),
      driver: sqlite3.Database
    };
  }
  
  // Para producción con base de datos persistente
  // Aquí podrías configurar PostgreSQL, MySQL, etc.
  return {
    filename: ':memory:', // Temporalmente en memoria
    driver: sqlite3.Database
  };
};

// Función para obtener la base de datos según el entorno
const getDb = async () => {
  if (isVercel) {
    return await getVercelDb();
  }
  
  if (isDevelopment) {
    return await getDevDb();
  }
  
  if (isProduction) {
    return await getProdDb();
  }
  
  // Fallback para otros entornos
  const config = getDbConfig();
  if (config) {
    return await open(config);
  }
  
  // Fallback final
  return await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });
};

export default getDb;
export { getDbConfig }; 