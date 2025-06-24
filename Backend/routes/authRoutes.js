import 'dotenv/config';  // equivalente a require('dotenv').config()
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbPromise from '../db/db.js'; // tu conexión SQLite

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const db = await dbPromise;

    await db.run(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
      [username, email, hash]
    );

    // Obtener el id del usuario insertado
    const user = await db.get('SELECT id, username FROM users WHERE email = ?', [email]);

    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    // Si el error es por clave única (usuario/email repetido) puedes manejarlo aquí
    res.status(500).json({ error: 'Error al registrar usuario o usuario ya existe.' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;
