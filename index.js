// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQL Server
connectDB();

// Rutas públicas
app.use('/api/auth', authRoutes);

// Ruta protegida
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.username}`, data: "Datos protegidos" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
