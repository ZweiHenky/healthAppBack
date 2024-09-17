const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ronchas77777@gmail.com',
      pass: 'nldm xxkw kdyi cgtc'
    }
});
  
  // Función para generar un código de 6 dígitos
const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};
  
  // Función para enviar el correo de verificación
const sendVerificationEmail = (email, code) => {
    const mailOptions = {
        from: 'ronnhy7@gmail.com',
        to: email,
        subject: 'Verificación de correo electrónico',
        html: `<h3>Tu código de verificación es:</h3><h1>${code}</h1>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error('Error al enviar el correo:', error);
        } else {
        console.log('Correo enviado:', info.response);
        }
    });
};

module.exports = {sendVerificationEmail, generateVerificationCode}
