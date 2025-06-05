const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro de conexão com MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;