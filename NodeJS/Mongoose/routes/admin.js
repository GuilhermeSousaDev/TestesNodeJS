const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
const Categoria = mongoose.model("Categorias")

router.get('/categorias', (req,res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
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
    Categoria.deleteMany({_id: req.params.id}).then(() => {
        req.flash("success", "Categoria Deletada com Sucesso")
        res.redirect('/admin/categorias')
    }).catch(() => {
        req.flash("error", "Erro ao Deletar Categoria")
        res.redirect('/admin/categorias')
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