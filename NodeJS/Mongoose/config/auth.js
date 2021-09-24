const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../models/Usuario')
const Usuario = mongoose.model("usuarios")

module.exports = passport => {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email,senha,done) => {
        Usuario.findOne({ email }).then(doc => {
            if(!doc) {
                return done(null, false, {message: "Esta conta não existe"})
            }
            bcrypt.compare(senha, doc.senha, (erro, batem) => {
                if(batem) {
                    return done(null, doc)
                }else {
                    return done(null, false, {message: "Senha Incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })
    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}