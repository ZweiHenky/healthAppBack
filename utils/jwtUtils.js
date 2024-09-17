// utils/jwtUtils.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  
  return jwt.sign({ email: user.FL_CORREO, name: user.FL_NOMBRE, code: user.FL_TOKEN }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = {
  generateToken,
};
