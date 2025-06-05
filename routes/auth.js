const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota de login
router.post('/login', async (req, res) => {
  // Implementar lógica de login
});

// Rota de cadastro
router.post('/cadastro', async (req, res) => {
  // Implementar lógica de cadastro
});

module.exports = router;