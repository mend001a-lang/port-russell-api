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

module.exports = { listerCatways };