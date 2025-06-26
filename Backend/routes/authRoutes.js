// routes/authRoutes.js
// --- NOTA: Cambiado a sintaxis ES6 (import/export) y conexión correcta con SQLite ---
// --- NOTA: Ahora se retorna un token JWT y el userId en /login ---

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbPromise from '../db/db.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'mi_super_secreto';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const db = await dbPromise;
    await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Usuario o email ya registrado' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // --- MODIFICACIÓN: Ahora se retorna JWT y userId ---
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '2d' });
    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
});

export default router;
