const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/aprendendo",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado com Sucesso")
}).catch(err => console.log("Erro ao conectar" + err))

const Usuarios = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String
    }
})

mongoose.model('usuarios', Usuarios)

const Usuario = mongoose.model('usuarios')

new Usuario({
    nome: "Guilherme",
    sobrenome: "Augusto",
    email: "a.guilherme@yahoo.com",
    idade: 16,
    pais: "Brasil"
}).save().then(() => console.log("Conectado com Sucesso...")).catch(err => console.log(err))