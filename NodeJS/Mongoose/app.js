const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const AdminRoute = require('./routes/admin')
const UsuarioRoute = require('./routes/usuario')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")

//Config
app.use('handlebars', handlebars({defaultLayout: 'main'}))
app.engine('handlebars', handlebars());
app.set('view engine','handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    secret: "nodejs",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use((req,res,next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

//Mongoose Connect
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado ao Mongo")
}).catch(e => {
    console.log("Erro" + e)
})

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