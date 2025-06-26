// index.js
// --- NOTA: Código limpio, uso de import/export, preparado para agregar middlewares de auth en el futuro ---

import 'dotenv/config'; // Carga variables de entorno
import express from 'express';
import cors from 'cors';

import predictRoute from './routes/predict.js';
import notesRoute from './routes/notes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// --- MODIFICACIÓN: Permite credenciales si luego usas cookies/token en headers (opcional, seguro para localhost) ---
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // Si vas a usar cookies/token en requests con credenciales
}));

app.use(express.json());

// --- NOTA: Rutas organizadas y fáciles de mantener ---
app.use('/auth', authRoutes);       // Rutas de autenticación
app.use('/predict', predictRoute);  // Rutas de IA/predicción
app.use('/notes', notesRoute);      // Rutas CRUD de notas

// --- MODIFICACIÓN: Ruta base para saber si el backend está vivo (útil para pruebas) ---
app.get('/', (req, res) => {
  res.send('🧠 NoteFlow backend corriendo!');
});

// --- NOTA: Puerto definido por variable de entorno o default ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
