const { Sequelize,sequelize } = require('./db')

const Post = sequelize.define('postagens', {
    titulo: {
        type: Sequelize.STRING
    },
    Conteudo: {
        type: Sequelize.TEXT
    }
})

module.exports = Post