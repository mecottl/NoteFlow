// Configuración específica para desarrollo local
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// En desarrollo, usar archivo SQLite persistente
let dbInstance = null;

export async function getDevDb() {
  if (!dbInstance) {
    const dbPath = path.join(__dirname, 'NoteFlow.sqlite');
    
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Inicializar tablas si no existen
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
    
    console.log('✅ Base de datos de desarrollo inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos de desarrollo:', error);
  }
}

// Función para limpiar la conexión (útil para testing)
export function clearDevDb() {
  dbInstance = null;
} 