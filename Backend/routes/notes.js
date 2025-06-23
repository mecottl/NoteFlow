import express from 'express';
import dbPromise from '../db/db.js';

const router = express.Router();

// Crear nota
router.post('/', async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const db = await dbPromise;
    const result = await db.run(
      `INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)`,
      [user_id, title, content]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear nota' });
  }
});

// Leer todas las notas de un usuario
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const db = await dbPromise;
    const notes = await db.all(`SELECT * FROM notes WHERE user_id = ?`, [user_id]);
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Error al leer notas' });
  }
});

// Leer una nota por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await dbPromise;
    const note = await db.get(`SELECT * FROM notes WHERE id = ?`, [id]);
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Error al leer nota' });
  }
});

// Actualizar nota
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const db = await dbPromise;
    await db.run(
      `UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, content, id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
});

// Eliminar nota
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await dbPromise;
    await db.run(`DELETE FROM notes WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar nota' });
  }
});

export default router;
