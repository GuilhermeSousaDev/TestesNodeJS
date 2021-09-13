const { log } = require('console')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
const Categoria = mongoose.model("Categorias")

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date: 'desc'}).lean().then(categorias => {
        res.render('AdminHtml/categorias', {categorias: categorias})
    }).catch(e => {
        req.flash("error", "Erro ao Listar as Cateorias")
        console.log(e)
    }) 
})

router.get("/categorias/add", (req,res) => {
    res.render("AdminHtml/addcategorias")
})
router.get("/categorias/delete/:id", (req,res) => {
    Categoria.deleteOne({_id: req.params.id}).then(() => {
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
        nome.length <= 2? erros.push({text: "Nome muito pequeno"}) : ''
        slug.length <= 2? erros.push({text: "Slug muito pequeno"}) : '' 
        nome === doc.nome? erros.push({text: "Nome igual ao antigo"}) : ''
        slug === doc.slug? erros.push({text: "Slug igual ao Antigo"}) : ''
        if(erros.length > 0) {
            res.render("AdminHtml/editcategorias", {erros: erros})
        }else {
            Categoria.updateOne({_id: doc._id}, {nome: nome, slug: slug}).then(() => {
                req.flash("success", "Editado com Sucesso")
                res.redirect("/admin/categorias")
                console.log(doc.nome)
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
    const {nome} = req.body
    const {slug} = req.body

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

module.exports = router