const jwt = require('jsonwebtoken');

// Middleware d'authentification
const verifyToken = (req, res, next) => {
    // Récupérer le token depuis les en-têtes de la requête
    const authHeader = req.headers['authorization'];
// Vérifier si le token est présent
    if (!authHeader) {
        return res.status(401).json ({message: 'Accés refusé, token manquant'});
    }
// Extraire le token de len-tête (format: "Bearer token")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Accés refusé, token manquant'});
    }

 try {
    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Passer au middleware suivant ou à la route protégée
    next();
 } catch (error) {
    res.status(401).json({message: 'Token invalide'});
 }
}

module.exports = {
    verifyToken
};