// config/db.js
const sql = require('mssql');

// Configuración de conexión a SQL Server
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Usar en servidores en la nube
    trustServerCertificate: true // Usar en desarrollo local
  }
};

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Conectado a SQL Server');
  } catch (err) {
    console.error('Error al conectar a la base de datos', err);
    process.exit(1);
  }
};

module.exports = {
  sql,
  connectDB
};
