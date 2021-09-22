const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get("/registro", (req,res) => {
    Usuario.find().lean().then(doc => {
        res.render("usuarios/registro", { doc })
    })
})
router.post("/registro", (req,res) => {
    const erros = []
    const { nome, email, senha, senha2 } = req.body
    if(!nome) {
        erros.push({text: "Nome Inválido"})
    }
    if(!email) {
        erros.push({text: "Email Inválido"})
    }
    if(senha.length < 4) {
        erros.push({text: "Senha muito curta"})
    }
    senha !== senha2? erros.push({text: "As senhas são diferentes, verifique sua senha"}) : ''

    senha.includes(12345) || senha.includes(54321)? erros.push({text: "Crie uma senha mais difícil"}) : ''

    if(erros.length > 0) {
        res.render("usuarios/registro", { erros })
    }else {
        Usuario.findOne({ email }).lean().then(doc => {
            if(doc) {
                req.flash("error", "Já existe uma conta com este email")
                res.redirect("/usuario/registro")
            }else {
                const User = new Usuario({ nome,email,senha })
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(User.senha, salt, (err, hash) => {
                        if(err) {
                            req.flash("error", "Erro no processo de salvamento")
                            res.redirect("/")
                        }
                        User.senha = hash
                        User.save().then(() => {
                            req.flash("success", "Usuário criado com sucesso")
                            res.redirect("/")
                        }).catch(e => {
                            res.redirect("/")
                            req.flash("error", "Houve um erro ao criar usuário")
                        })
                    })
                })
            }
        }).catch(e => {
            console.log(e)
            res.redirect("/")
        })
    }
})


module.exports = router