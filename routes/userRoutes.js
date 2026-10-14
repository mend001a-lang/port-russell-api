const express = require("express");
const verifierTokenMiddleware = require("../middlewares/verifierToken");

const {
    inscrireUtilisateur,
    connecterUtilisateur
} = require("../controllers/userController");

const router = express.Router();
// Inscription d'un utilisateur
router.post("/register", inscrireUtilisateur);

// Connexion d'un utilisateur
router.post("/login", connecterUtilisateur);

router.get("/profile", verifierTokenMiddleware, (req, res) => {
    res.status(200).json({
        message: "Bienvenue dans votre espace sécurisé !",
        userId: req.user.userId
    });
});



module.exports = router;