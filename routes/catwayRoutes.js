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

module.exports = router;