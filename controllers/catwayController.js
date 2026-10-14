const Catway = require("../models/Catway");
const listerCatways = async (req, res) => {
    try {
        const catways = await Catway.find();

        return res.status(200).json(catways);

    } catch (error) {
        console.error("Erreur récupération catways :", error.message);

return res.status(500).json({
    message: "Erreur lors de la récupération des catways"
});

    }
};;

const obtenirCatwayParId = async (req, res) => {
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
console.error("Erreur récupération du catway :", error.message);

return res.status(500).json({
    message: "Erreur lors de la récupération du catway"
});
    }
};
const creerCatway = async (req, res) => {
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
// Vérifier si le numéro existe déjà dans MongoDB
const catwayExistant = await Catway.findOne({
    catwayNumber: catwayNumber
});
// Refuser un numéro de catway déjà utilisé
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
// Confirmer la création du catway
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
};

// Contrôleur pour modifier l'état d'un catway
const modifierCatway = async (req, res) => {
     try {
    const id = Number(req.params.id);
    // Vérifier que le numéro du catway est valide
if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
        message: "Numéro de catway invalide"
    });
}
// Récupérer le nouvel état du catway
const { catwayState } = req.body || {};
// Vérifier que le nouvel état est renseigné
if (typeof catwayState !== "string" || catwayState.trim() === "") {
    return res.status(400).json({
        message: "Veuillez renseigner le nouvel état du catway"
    });
}
// Modifier l'état du catway dans MongoDB
const catwayModifie = await Catway.findOneAndUpdate(
    { catwayNumber: id },
    { catwayState: catwayState.trim() },
    { returnDocument: "after" }
);
// Vérifier si le catway existe
if (!catwayModifie) {
    return res.status(404).json({
        message: "Catway introuvable"
    });
}
// Confirmer la modification du catway
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
};


module.exports = {
    listerCatways,
    obtenirCatwayParId,
    creerCatway,
    modifierCatway
};