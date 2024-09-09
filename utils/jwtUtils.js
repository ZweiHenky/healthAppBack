// utils/jwtUtils.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  
  return jwt.sign({ email: user.FL_CORREO }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = {
  generateToken,
};
