const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
require('../models/Postagem')
const Categoria = mongoose.model("Categorias")
const Postagem = mongoose.model("postagens")

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date: 'desc'}).lean().then(categorias => {
        res.render('AdminHtml/categorias', {categorias: categorias})
    }).catch(e => {
        req.flash("error", "Erro ao Listar as Cateorias")
    }) 
})

router.get("/categorias/add", (req,res) => {
    res.render("AdminHtml/addcategorias")
})

router.get("/categorias/delete/:id", (req,res) => {
    Categoria.deleteOne({_id: req.params.id.toString()}).then(() => {
        req.flash("success", "Categoria Deletada com Sucesso")
        res.redirect('/admin/categorias')
    }).catch(() => {
        req.flash("error", "Erro ao Deletar Categoria")
        res.redirect('/admin/categorias')
    })
})

router.get("/categorias/edit/:id", (req,res) => {
    Categoria.findOne({_id: req.params.id}).lean().then(categoria => {
        res.render("AdminHtml/editcategorias", {categoria: categoria})
    }).catch(() => {
        req.flash("error", "Esta Categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/editar', (req,res) => {
    Categoria.findOne({_id: req.body.id}).lean().then(doc => { 
        const erros = []
        const {nome} = req.body
        const {slug} = req.body
        nome.length < 2? erros.push({text: "Nome muito pequeno"}) : ''
        slug.length < 2? erros.push({text: "Slug muito pequeno"}) : '' 
        nome === doc.nome? erros.push({text: "Nome igual ao antigo"}) : ''
        slug === doc.slug? erros.push({text: "Slug igual ao Antigo"}) : ''
        if(erros.length > 0) {
            res.render("AdminHtml/editcategorias", {erros: erros})
        }else {
            Categoria.updateOne({_id: doc._id}, {nome: nome, slug: slug}).then(() => {
                req.flash("success", "Editado com Sucesso")
                res.redirect("/admin/categorias")
            }).catch(e => {
                console.log(e)
                req.flash("error", "Erro ao Editar")
                res.redirect("/admin/categorias")
            }) 
        }       
    })
})
router.post('/categorias/new', (req,res) => {
    const erros = []
    const {nome,slug} = req.body

    if(nome.length <= 2 || slug.length <= 2) {
        erros.push({text: "Nome muito pequeno"})
        erros.push({text: "Slug muito pequeno"})
    }
    if(erros.length > 0) {
        res.render("AdminHtml/addcategorias", {erros: erros})
    }else {
        Categoria.create({
            nome: nome,
            slug: slug
        }).then(() => {
            req.flash("success","Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch(e => {
            req.flash("error","Erro ao salvar categoria")
            res.redirect("/admin")
        })
    }
})
//Postagens rotas

router.get("/postagens", (req,res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((doc) => {
        res.render("AdminHtml/postagens", {postagem: doc})
    }).catch(() => {
        req.flash("error", "Erro")
    })
})

router.get("/postagens/add", (req,res) => {
    Categoria.find().lean().then(doc => {
        res.render("AdminHtml/addpostagens", {categoria: doc})
    }).catch(e => {
        req.flash("error", "Houve um erro ao carregar o formulário")
        res.redirect("/admin/postagem")
    })
})
router.post("/postagens/new", (req,res) => {
    const { titulo, slug, descricao, conteudo, categoria } = req.body
    const erros = []
    if(categoria == "0") {
        erros.push({text: "Categoria Inválida, crie uma categoria"})
    }
    if(erros.length > 0) {
        res.render("AdminHtml/postagens", {erros: erros})
    }else{
        Postagem.create({
            titulo: titulo,
            slug: slug,
            descricao: descricao,
            conteudo: conteudo,
            categoria: categoria
        }).then(() => {
            req.flash("success", "Postagem criada com Sucesso")
            res.redirect("/admin/postagens")
        }).catch(e => {
            req.flash("error", "Erro ao criar postagem")
            console.log(e)
        })
    }
})

router.get("/postagens/edit/:id", (req,res) => {
    Postagem.findOne({_id: req.params.id}).populate('categoria').lean().then((doc) => {
        Categoria.find().lean().then((categoria) => {
            res.render("AdminHtml/editpostagens", {postagem: doc, categoria: categoria})
        })
    }).catch(() => {
        req.flash("error", "Erro ao Procurar postagem")
    })
})
router.post("/postagens/editar", (req,res) => {
    const { titulo, slug, descricao, conteudo, categoria } = req.body
    Postagem.updateOne({_id: req.body.id}, {
        titulo: titulo,
        slug: slug,
        descricao: descricao,
        conteudo: conteudo,
        categoria: categoria
    }).then(() => {
        req.flash("success", "Postagem editada com sucesso")
        res.redirect("/admin/postagens")
    }).catch(() => {
        req.flash("error", "Erro ao editar categoria")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/delete/:id", (req,res) => {
    Postagem.deleteOne({_id: req.params.id.toString()}).then(() => {
        req.flash("success", "Postagem Deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch(e => {
        console.log(e)
        req.flash("error", "Erro ao deletar")
        res.redirect("/admin/postagens")
    })
})
module.exports = router