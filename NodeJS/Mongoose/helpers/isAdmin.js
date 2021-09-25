module.exports = {
    isAdmin: (req,res,next) => {
        if(req.isAuthenticated() && req.user.admin == 1) {
            return next()
        }else {
            req.flash("error", "Você deve ser admin para acessar esta página")
            res.redirect("/")
        }
    }
}