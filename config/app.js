require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importação das rotas (adicione estas linhas)
const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/produtos');
const pedidoRoutes = require('./routes/pedidos');

const app = express();

// Conexão com o MongoDB (mantenha o que já existia)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro no MongoDB:', err));

// Middlewares (mantenha esses)
app.use(cors());
app.use(express.json());

// Rotas (adicione esta seção)
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota padrão (pode manter se já existir)
app.get('/', (req, res) => {
  res.send('API Achadinhos BR está funcionando!');
});

// Inicia o servidor (mantenha esta parte)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});