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
    const {nome} = req.body
    const {slug} = req.body
    new Categoria({
        nome: nome,
        slug: slug
    }).save().then(() => {
        console.log("Categoria salva")
        res.redirect('/')
    }).catch(e => {
        console.log(e)
    })
})

module.exports = router