const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

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
module.exports = router;