const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');

// Criar pedido e pagamento
router.post('/', async (req, res) => {
    try {
        const { itens, infoEntrega, metodoPagamento } = req.body;
        
        // Verificar estoque
        for (const item of itens) {
            const produto = await Produto.findById(item.produto);
            if (produto.estoque < item.quantidade) {
                return res.status(400).json({ 
                    message: `Estoque insuficiente para o produto ${produto.nome}`
                });
            }
        }
        
        // Criar preferência no Mercado Pago
        const preference = {
            items: itens.map(item => ({
                title: item.nome,
                unit_price: item.preco,
                quantity: item.quantidade,
                picture_url: item.imagem
            })),
            payer: {
                name: infoEntrega.nome,
                email: infoEntrega.email,
                phone: {
                    number: infoEntrega.telefone
                },
                address: {
                    zip_code: infoEntrega.cep,
                    street_name: infoEntrega.endereco,
                    street_number: infoEntrega.numero,
                    neighborhood: infoEntrega.bairro,
                    city: infoEntrega.cidade,
                    federal_unit: infoEntrega.estado
                }
            },
            payment_methods: {
                installments: metodoPagamento === 'credito' ? 12 : 1,
                default_installments: 1
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/checkout.html?success=true`,
                failure: `${process.env.FRONTEND_URL}/checkout.html?success=false`,
                pending: `${process.env.FRONTEND_URL}/checkout.html?success=pending`
            },
            auto_return: 'approved',
            notification_url: `${process.env.BACKEND_URL}/api/pedidos/notificacao`
        };
        
        const response = await mercadopago.preferences.create(preference);
        
        // Criar pedido no banco de dados
        const pedido = new Pedido({
            itens,
            infoEntrega,
            metodoPagamento,
            total: itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
            status: 'pendente',
            idMP: response.body.id
        });
        
        await pedido.save();
        
        res.json({ init_point: response.body.init_point, pedidoId: pedido._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para notificações do Mercado Pago
router.post('/notificacao', async (req, res) => {
    try {
        const { id, topic } = req.query;
        
        if (topic === 'payment') {
            const payment = await mercadopago.payment.findById(id);
            const pedido = await Pedido.findOne({ idMP: payment.body.order.id });
            
            if (pedido) {
                pedido.status = payment.body.status === 'approved' ? 'pago' : 'cancelado';
                await pedido.save();
                
                // Atualizar estoque se o pagamento foi aprovado
                if (payment.body.status === 'approved') {
                    for (const item of pedido.itens) {
                        await Produto.findByIdAndUpdate(item.produto, {
                            $inc: { estoque: -item.quantidade, vendidos: item.quantidade }
                        });
                    }
                }
            }
        }
        
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;