import 'dotenv/config';  // equivalente a require('dotenv').config()

import express from 'express';
import cors from 'cors';

import predictRoute from './routes/predict.js';
import notesRoute from './routes/notes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/predict', predictRoute);
app.use('/notes', notesRoute);


app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
