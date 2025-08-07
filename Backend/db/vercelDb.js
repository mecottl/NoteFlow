// Configuración específica para Vercel (serverless)
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// En Vercel, cada función serverless necesita su propia conexión
let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: ':memory:', // Base de datos en memoria para Vercel
      driver: sqlite3.Database
    });
    
    // Inicializar tablas
    await initTables(dbInstance);
  }
  
  return dbInstance;
}

async function initTables(db) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS note_tags (
        note_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (note_id, tag_id),
        FOREIGN KEY (note_id) REFERENCES notes (id),
        FOREIGN KEY (tag_id) REFERENCES tags (id)
      );
    `);
    
    console.log('✅ Tablas inicializadas en Vercel');
  } catch (error) {
    console.error('❌ Error inicializando tablas en Vercel:', error);
  }
}

// Función para limpiar la conexión (útil para testing)
export function clearDb() {
  dbInstance = null;
} 