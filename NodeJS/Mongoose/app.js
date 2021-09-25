const express = require('./config/customExpress')
const app = express()
const passport = require("passport")
const mongoose = require('mongoose')
const AdminRoute = require('./routes/admin')
const UsuarioRoute = require('./routes/usuario')
require("./models/Postagem")
require("./config/auth")(passport)
const Postagem = mongoose.model("postagens")

//Mongoose Connect
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogapp")

//Rotas
app.get('/', (req,res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).lean().then(docs => {
        res.render("index", { docs })
    }).catch(e => {
        console.log(e)
        res.redirect('/404')
    })
})
app.get("/postagem/:slug", (req,res) => {
    const {slug} = req.params
    Postagem.findOne({ slug }).lean().then(doc => {
        if(doc) {
            res.render("postagem/index", { doc })
        }else {
        req.flash("error", "Esta Postagem não existe")
        res.redirect("/")
        }
    }).catch(e => {
        req.flash("error", "Erro Interno")
        res.redirect("/")
    })
})
app.get(() => res.send("Erro 404"))
app.use('/admin', AdminRoute)
app.use('/usuario', UsuarioRoute)


const port = 8081
app.listen(port, () => console.log(`Iniciado na porta ${8081}`))