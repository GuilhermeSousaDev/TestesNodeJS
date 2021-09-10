const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const AdminRoute = require('./routes/admin')

//Config
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

app.use('handlebars', handlebars({defaultLayout: 'main'}))
app.engine('handlebars', handlebars());
app.set('view engine','handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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
    res.send("Hello World")
})
app.use('/admin', AdminRoute)


const port = 8081
app.listen(port, () => console.log(`Iniciado na porta ${8081}`))