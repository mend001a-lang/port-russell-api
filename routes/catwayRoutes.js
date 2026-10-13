const express = require("express");
const Catway = require("../models/Catway");

const router = express.Router();


// Récupération des catways depuis MongoDB
router.get("/", async (req, res) => {
    console.log("TEST : nouvelle route catways dans catwayRoutes.js !");
    try {
        const catways = await Catway.find();

        return res.status(200).json(catways);

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Erreur lors de la récupération des catways"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Vérifier le numéro
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide"
            });
        }

        // Rechercher le catway
        const catway = await Catway.findOne({
            catwayNumber: id
        });

        // Catway introuvable
        if (!catway) {
            return res.status(404).json({
                message: "Catway introuvable"
            });
        }

        // Envoyer le catway trouvé
        return res.status(200).json(catway);

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Erreur lors de la récupération du catway"
        });
    }
});

module.exports = router;