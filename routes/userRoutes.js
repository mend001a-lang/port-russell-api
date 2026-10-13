const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const verifierTokenMiddleware = require("../middlewares/verifierToken");

const router = express.Router();
router.post("/register", async (req, res) => {
console.log("TEST : nouvelle route inscription userRoutes.js !");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires."
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "Utilisateur créé avec succès !"
        });

    } catch (error) {
        console.error("Erreur inscription :", error.message);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
});

router.post("/login", async (req, res) => {
    console.log("TEST : nouvelle route connexion userRoutes.js !");
    const { email, password } = req.body || {};
    

    // Vérifier les champs obligatoires
    if (!email || !password) {
        return res.status(400).json({
            message: "Email et mot de passe obligatoires."
        });
    }

    try {
        // Rechercher l'utilisateur
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // Vérifier le mot de passe
        const passwordValide = await bcrypt.compare(password, user.password);

        if (!passwordValide) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Connexion réussie !",
            token: token
        });

    } catch (error) {
        console.error("Erreur connexion :", error.message);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
});


router.get("/profile", verifierTokenMiddleware, (req, res) => {
    res.status(200).json({
        message: "Bienvenue dans votre espace sécurisé !",
        userId: req.user.userId
    });
});

module.exports = router;