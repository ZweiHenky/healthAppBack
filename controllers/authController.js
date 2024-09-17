// controllers/authController.js
const bcrypt = require('bcryptjs');
const { sql } = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');
const { generateVerificationCode, sendVerificationEmail } = require('../utils/sendVerificationEmail');

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
    const codeValidation = generateVerificationCode()

    // Insertar nuevo usuario en la base de datos
    await sql.query`INSERT INTO TB_USUARIO (FL_CORREO, FL_CONTRASENA, FL_TOKEN) VALUES (${email}, ${hashedPassword}, ${codeValidation})`;
    
    sendVerificationEmail(email, codeValidation)

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const validateToken = async (req, res) => {
  const {email, token} = req.body

  if (typeof token != 'number') {
    return res.status(400).json({ message: 'El token tiene que ser entero' });
  }

  try {
    // Verificar si el usuario ya existe
    const result = await sql.query`SELECT FL_TOKEN FROM TB_USUARIO WHERE FL_CORREO = ${email}`;
    if (result.recordset.length == 0) {
      return res.status(404).json({ message: 'El usuario no esta registrado' });
    }

    const user = result.recordset[0]

    if (user.FL_TOKEN == token) {
      const deleteToken = await sql.query`UPDATE TB_USUARIO SET FL_TOKEN = NULL WHERE FL_CORREO = ${email}`

      // if (deleteToken.rowsAffected[0] != 1) {
      //   return res.status(200).json({message: 'Ocurrio un error al validar '})
      // }
      
      return res.status(200).json({message: 'Verificacion con exito'})
    } else {
      return res.status(200).json({message: 'El codigo es incorrecto'})      
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  } 
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const result = await sql.query`SELECT * FROM TB_USUARIO WHERE FL_CORREO = ${email}`;
    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'El usuario no existe' });
    }

    const user = result.recordset[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.FL_CONTRASENA);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    console.log(user);
    

    // Generar token JWT
    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  register,
  login,
  validateToken
};
