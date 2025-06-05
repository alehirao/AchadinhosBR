const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  produtos: [{
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
    quantidade: Number,
    precoUnitario: Number
  }],
  total: Number,
  status: { type: String, default: 'pendente' },
  dataPedido: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);