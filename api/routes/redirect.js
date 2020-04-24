module.exports.loginUser = (req, res, next) => {
    if (req.isAuthenticated()){
        res.redirect('/');
    } else {
        next();
    }
}

module.exports.nonLoginUser = (req, res, next) => {
    if (req.isUnauthenticated()){
        res.redirect('/login');
    } else {
        next();
    }
}