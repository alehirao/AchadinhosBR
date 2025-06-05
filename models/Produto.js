const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    precoAntigo: Number,
    categoria: {
        type: String,
        required: true
    },
    imagens: [String],
    estoque: {
        type: Number,
        required: true,
        default: 0
    },
    vendidos: {
        type: Number,
        default: 0
    },
    avaliacao: {
        type: Number,
        default: 0
    },
    numAvaliacoes: {
        type: Number,
        default: 0
    },
    caracteristicas: [{
        nome: String,
        valor: String
    }],
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Produto', produtoSchema);