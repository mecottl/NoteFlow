// Script para inicializar la base de datos
import getDb from './db/dbConfig.js';

async function initDatabase() {
  try {
    console.log('🔍 Inicializando base de datos...');
    const db = await getDb();
    console.log('✅ Base de datos conectada');
    
    // Crear tablas si no existen
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

    console.log('✅ Tablas creadas correctamente');
    
    // Verificar que las tablas existen
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tablas existentes:', tables.map(t => t.name));
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
}

initDatabase(); 