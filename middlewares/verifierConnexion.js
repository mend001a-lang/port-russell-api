const jwt = require("jsonwebtoken");

// =====================================
// MIDDLEWARE : VÉRIFIER LA CONNEXION
// =====================================

function verifierConnexion(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/");
    }
}

// =====================================
// EXPORT DU MIDDLEWARE
// =====================================

module.exports = verifierConnexion;