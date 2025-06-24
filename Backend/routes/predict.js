import express from 'express';
import iaService from '../services/iaService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Falta o tipo inválido de prompt' });
  }

  try {
    const prediction = await iaService.getPrediction(prompt);
    res.json({ prediction });
  } catch (error) {
    console.error('❌ Error en /predict:', error.message || error);
    res.status(500).json({ error: 'Error al obtener predicción de IA.' });
  }
});

export default router;
