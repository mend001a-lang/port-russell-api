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

module.exports = { listerCatways, obtenirCatwayParId };