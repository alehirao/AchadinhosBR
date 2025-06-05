const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// Buscar todos os produtos (com filtros)
router.get('/', async (req, res) => {
    try {
        const { categoria, precoMin, precoMax, busca, ordenar } = req.query;
        const query = {};
        
        if (categoria) query.categoria = categoria;
        if (precoMin || precoMax) {
            query.preco = {};
            if (precoMin) query.preco.$gte = Number(precoMin);
            if (precoMax) query.preco.$lte = Number(precoMax);
        }
        if (busca) {
            query.$or = [
                { nome: { $regex: busca, $options: 'i' } },
                { descricao: { $regex: busca, $options: 'i' } }
            ];
        }
        
        let sort = {};
        if (ordenar) {
            if (ordenar === 'preco-asc') sort = { preco: 1 };
            if (ordenar === 'preco-desc') sort = { preco: -1 };
            if (ordenar === 'mais-vendidos') sort = { vendidos: -1 };
            if (ordenar === 'melhor-avaliados') sort = { avaliacao: -1 };
        }
        
        const produtos = await Produto.find(query).sort(sort);
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
        
        // Buscar produtos relacionados
        const relacionados = await Produto.find({
            categoria: produto.categoria,
            _id: { $ne: produto._id }
        }).limit(4);
        
        res.json({ produto, relacionados });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;