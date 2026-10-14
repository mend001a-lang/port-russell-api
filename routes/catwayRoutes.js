const express = require("express");
const Catway = require("../models/Catway");

    const {
    listerCatways,
    obtenirCatwayParId,
    creerCatway,
    modifierCatway,
    supprimerCatway
} = require("../controllers/catwayController");

const router = express.Router();


// Récupération des catways depuis MongoDB
router.get("/", listerCatways);

router.get("/:id", obtenirCatwayParId);

router.post("/", creerCatway);

router.put("/:id", modifierCatway);

router.delete("/:id", supprimerCatway);

module.exports = router;