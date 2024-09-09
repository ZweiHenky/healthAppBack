// controllers/authController.js
const bcrypt = require('bcryptjs');
const { sql } = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const result = await sql.query`SELECT * FROM TB_USUARIO WHERE FL_CORREO = ${email}`;
    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario en la base de datos
    await sql.query`INSERT INTO TB_USUARIO (FL_CORREO, FL_CONTRASENA) VALUES (${email}, ${hashedPassword})`;

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const result = await sql.query`SELECT * FROM TB_USUARIO WHERE FL_CORREO = ${email}`;
    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const user = result.recordset[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.FL_CONTRASENA);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  register,
  login,
};
