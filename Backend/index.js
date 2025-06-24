require('dotenv').config();

const express = require('express');
const cors = require('cors'); // 👈 Agregas cors
const app = express();
const predictRoute = require('./routes/predict');

app.use(cors({
    origin: 'http://localhost:5173', // 👈 Cambia esto si tu frontend está en otro dominio
})); // 👈 Lo usas aquí antes de las rutas
app.use(express.json());
app.use('/predict', predictRoute);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
