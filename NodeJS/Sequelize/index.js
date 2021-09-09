const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require('./models/Post')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Rotas
app.get('/home', (req,res) => {
    Post.findAll({order: [['id','DESC']]}).then(posts => {
        res.render('home', {posts: posts})
    })
})

app.get('/', (req,res) => {
    res.render('formulario')
})

app.post('/form', (req,res) => {
    const {titulo,content} = req.body
    Post.create({
        titulo: titulo,
        Conteudo: content
    }).then(() => {
        res.redirect('/home')
    }).catch((err) => console.log(err))
})
app.post('/deletar', (req,res) => {
    const {id} = req.body
    Post.destroy({where: {'id': id}}).then(() => {
        res.send("Deletado com Sucesso")
    }).catch(err => console.log(err))
})

app.listen(8081,() => console.log(`Servidor Iniciado na porta 8081`))