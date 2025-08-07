// routes/notes.js
// --- NOTA: Rutas limpias y correctas, usan ES6, y filtran por userId ---

import express from 'express';
import getDb from '../db/db.js';

const router = express.Router();

// Crear nota
router.post('/', async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)`,
      [user_id, title, content]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear nota' });
  }
});

// Obtener todas las notas de un usuario
router.get('/user/:userId', async (req, res) => {
  // --- MODIFICACIÓN: Cambié 'user_id' por 'userId' para que coincida con frontend/localStorage ---
  const { userId } = req.params;
  try {
    const db = await getDb();
    const notes = await db.all(`SELECT * FROM notes WHERE user_id = ?`, [userId]);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer notas' });
  }
});

// Obtener nota individual
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const note = await db.get(`SELECT * FROM notes WHERE id = ?`, [id]);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer nota' });
  }
});

// Actualizar nota
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const db = await getDb();
    await db.run(
      `UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, content, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
});

// Eliminar nota
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.run(`DELETE FROM notes WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar nota' });
  }
});

export default router;
