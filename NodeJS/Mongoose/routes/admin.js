const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categorias')
const Categoria = mongoose.model("Categorias")

router.get('/', (req,res) => {
    res.render('AdminHtml/index')
})

router.get('/posts', (req,res) => {
    res.send("Pag De Posts")
})

router.get('/categorias', (req,res) => {
    res.render("AdminHtml/categorias")
})

router.get("/categorias/add", (req,res) => {
    res.render("AdminHtml/addcategorias")
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
        new Categoria({
            nome: nome,
            slug: slug
        }).save().then(() => {
            req.flash("success","Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch(e => {
            req.flash("error","Erro ao salvar categoria")
            res.redirect("/admin")
        })
    }
})

module.exports = router