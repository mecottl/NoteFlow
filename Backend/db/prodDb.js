// Configuración específica para producción (futuro)
// Aquí se puede integrar PostgreSQL, MySQL, o cualquier otra base de datos

import config from '../config/env.js';

// Por ahora, usar SQLite en memoria como fallback
// En el futuro, aquí se configuraría la conexión a la base de datos externa
export async function getProdDb() {
  // TODO: Implementar conexión a base de datos externa
  // Ejemplo para PostgreSQL:
  /*
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: config.DB_URL,
    ssl: { rejectUnauthorized: false }
  });
  return pool;
  */
  
  // Por ahora, usar SQLite en memoria como fallback
  const sqlite3 = await import('sqlite3');
  const { open } = await import('sqlite');
  
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });
  
  // Inicializar tablas
  await initTables(db);
  
  return db;
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
    
    console.log('✅ Base de datos de producción inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos de producción:', error);
  }
}

export default getProdDb; 