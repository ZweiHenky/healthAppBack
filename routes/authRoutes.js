// routes/authRoutes.js
const express = require('express');
const { register, login, validateToken } = require('../controllers/authController');

const router = express.Router();

// Ruta para registrarse
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

router.post('/validate-token', validateToken)

module.exports = router;
