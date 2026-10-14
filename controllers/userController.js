const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Contrôleur : inscription d'un utilisateur
const inscrireUtilisateur = async (req, res) => {

    const { name, email, password } = req.body || {};

    // 1. Vérifier les champs obligatoires
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires."
        });
    }

    try {
        // 2. Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé."
            });
        }

        // 3. Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Créer le nouvel utilisateur
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // 5. Enregistrer dans MongoDB
        await newUser.save();

        // 6. Confirmer l'inscription
        return res.status(201).json({
            message: "Utilisateur créé avec succès !"
        });

    } catch (error) {
        console.error("Erreur inscription :", error.message);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }
};


// Contrôleur : connexion d'un utilisateur
const connecterUtilisateur = async (req, res) => {

    const { email, password } = req.body || {};

    // 1. Vérifier les champs obligatoires
    if (!email || !password) {
        return res.status(400).json({
            message: "Email et mot de passe obligatoires."
        });
    }

    try {
        // 2. Rechercher l'utilisateur
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // 3. Vérifier le mot de passe
        const passwordValide = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValide) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // 4. Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 5. Confirmer la connexion
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
};

// Exporter le contrôleur
module.exports = {
    inscrireUtilisateur,
    connecterUtilisateur
};