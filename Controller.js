const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models'); 

const models=require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get('/', function(req, res){
    res.send('Ola, mundo!')
});

app.post('/servicos', async(req,res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Servico criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
});

app.post('/clientes', async(req, res) =>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Cliente criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
});

app.post('/pedidos', async(req, res)=>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "foi impossivel se conectar."
        })
    });
});

app.post('/itenspedido' , async(req, res) =>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });

});

app.post('/compras', async(req,res)=>{
    await compra.create(
       req.body
    ).then(function(){
        return res.json({
            error: false, 
            message: "Compra cadastrada com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/produtos', async(req,res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto cadastrado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "foi impossível se conectar."
        })
    });   
});

app.post('/itemcompras', async(req,res)=>{
    await itemcompra.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "foi impossível se conectar."
        })
    });
});

app.get('/listaservicos', async(req, res) =>{
    await servico.findAll({
        //raw: true
        order:[['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listaclientes', async(req,res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/listapedidos', async(req,res)=>{
    await pedido.findAll({
        raw: true
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

app.get('/listaitempedidos', async(req,res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(itempedidos){
        res.json({itempedidos})
    });
});

app.get('/ofertaservicos', async(req, res) =>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/listaprodutos',async(req,res)=>{
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        res.json({produtos})
    });
});

app.get('/listacompras', async(req,res)=>{
    await compra.findAll({
        raw: true
    }).then(function(compras){
        res.json({compras})
    });
});

app.get('/listaitemcompras', async(req,res)=>{
    await compra.findAll({
        raw: true
    }).then(function(itemcompras){
        res.json({itemcompras})
    });
});

app.get('/compras/:id', async(req, res)=>{
    await compra.findByPk(req.params.id,{include:[{all: true}]})
    .then(comp=>{
        return res.json({comp});
    });
});

app.put('/compras/:id/editaritem', async(req, res)=>{
    const item={
        data: req.body.data,
    };

    if (!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "compra não encontrada."
        });
    };

    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: "Produto não encontrado."
        });
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Compra alterada com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar."
        });
    });
});

app.get('excluircompra/:id', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possivel excluir a compra."
        });
    });
});

app.get('excluirproduto/:id', async(req, res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "produto excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possivel excluir o produto."
        });
    });
});

app.get('/servico/:id', async(req, res) =>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Codigo não encontrado!"
        });
    });
});

app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Servico alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Falha na alteracao do servico."
        });
    });
});

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            messagem: 'Servico não encontrado.'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possivel alterar."
        });
    });
});

app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: 'Cliente excluido com sucesso!'
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem: "Erro ao excluir o cliente."
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})