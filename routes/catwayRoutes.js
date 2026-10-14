const express = require("express");
const Catway = require("../models/Catway");
const {
    listerCatways,
    obtenirCatwayParId,
    creerCatway,
    modifierCatway
} = require("../controllers/catwayController");

const router = express.Router();


// Récupération des catways depuis MongoDB
router.get("/", listerCatways);

router.get("/:id", obtenirCatwayParId);

router.post("/", creerCatway);

router.put("/:id", modifierCatway);

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        message: "Numéro de catway invalide"
    });
}
    try {
        const catwaySupprime = await Catway.findOneAndDelete({
    catwayNumber: id
});
if (!catwaySupprime) {
    return res.status(404).json({
        message: "Catway introuvable"
    });
}

return res.status(200).json({
    message: "Catway supprimé avec succès",
    catway: catwaySupprime
});

    } catch (error) {
        console.error("Erreur suppression catway :", error.message);

return res.status(500).json({
    message: "Erreur lors de la suppression du catway"
});

    }
});

module.exports = router;