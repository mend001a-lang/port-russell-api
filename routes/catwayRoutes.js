const express = require("express");
const Catway = require("../models/Catway");
const { listerCatways, obtenirCatwayParId } = require("../controllers/catwayController");

const router = express.Router();


// Récupération des catways depuis MongoDB
router.get("/", listerCatways);

router.get("/:id", obtenirCatwayParId);

router.post("/", async (req, res) => {
    try {
        const {
            catwayNumber,
            catwayType,
            catwayState
        } = req.body || {};

        // Vérifier le numéro du catway
if (!Number.isInteger(catwayNumber) || catwayNumber <= 0) {
    return res.status(400).json({
        message: "Numéro de catway invalide"
    });
    
}
// Vérifier le type de catway
if (catwayType !== "long" && catwayType !== "short") {
    return res.status(400).json({
        message: "Le type de catway doit être long ou short"
    });
}
// Vérifier l'état du catway
if (
    typeof catwayState !== "string" ||
    catwayState.trim() === ""
) {
    return res.status(400).json({
        message: "Veuillez renseigner l'état du catway"
    });
}
// Vérifier si le numéro existe déjà
const catwayExistant = await Catway.findOne({
    catwayNumber: catwayNumber
});

if (catwayExistant) {
    return res.status(409).json({
        message: "Ce numéro de catway existe déjà"
    });
}
   // Créer le nouveau catway dans MongoDB
const nouveauCatway = await Catway.create({
    catwayNumber: catwayNumber,
    catwayType: catwayType,
    catwayState: catwayState.trim()
});

// Confirmer la création
return res.status(201).json({
    message: "Catway créé avec succès",
    catway: nouveauCatway
});

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Erreur lors de la création du catway"
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        // Récupérer le numéro du catway dans l'URL
        const id = Number(req.params.id);

        console.log("Numéro du catway :", id);
        // Vérifier le numéro du catway
if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        message: "Numéro de catway invalide"
    });
}

// Récupérer le nouvel état du catway
const { catwayState } = req.body || {};

// Vérifier le nouvel état
if (typeof catwayState !== "string" || catwayState.trim() === "") {
    return res.status(400).json({
        message: "Veuillez renseigner le nouvel état du catway"
    });
}

const catwayModifie = await Catway.findOneAndUpdate(
    { catwayNumber: id },
    { catwayState: catwayState.trim() },
    { returnDocument: "after" }
);
if (!catwayModifie) {
    return res.status(404).json({
        message: "Catway introuvable"
    });
}

return res.status(200).json({
    message: "Catway modifié avec succès",
    catway: catwayModifie
});

    } catch (error) {
        console.error("Erreur modification catway :", error.message);

        return res.status(500).json({
            message: "Erreur lors de la modification du catway"
        });
    }
});

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