const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport")
const path = require('path')

module.exports = () => {
    const app = express()
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

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
    app.use((req,res,next) => {
        res.locals.success = req.flash("success")
        res.locals.error = req.flash("error")
        res.locals.err = req.flash("err")
        res.locals.user = req.user || null
        next()
    })

    app.use(express.static(path.join(__dirname, 'public')))
    return app
}