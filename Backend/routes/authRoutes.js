// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDb from '../db/dbConfig.js';
import config from '../config/env.js';

const router = express.Router();
const SECRET = config.JWT_SECRET;

// --- REGISTRO ---
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const db = await getDb();
    await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    
    // Consulta el usuario recien creado para devolver datos
    const user = await db.get('SELECT id, username FROM users WHERE email = ?', [email]);
    
    // Opción: genera token automático tras registro
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    res.json({
      success: true,
      token,
      userId: user.id,
      username: user.username
    });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(400).json({ error: 'Usuario o email ya registrado' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Devuelve token, userId y username
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    res.json({
      token,
      userId: user.id,
      username: user.username
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
});

export default router;
