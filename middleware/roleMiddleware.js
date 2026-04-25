const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({message: "Accés refusé : droit administrateur requis"});
    }
    next();
}

module.exports = {isAdmin};