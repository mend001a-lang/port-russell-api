const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

// =====================================
// GET : RÉSERVATIONS D'UN CATWAY
// =====================================

const getReservationsByCatway = async (req, res) => {
    try {
        const numero = Number(req.params.id);

        if (!Number.isInteger(numero) || numero <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide."
            });
        }

        const catway = await Catway.findOne({
            catwayNumber: numero
        });

        if (!catway) {
            return res.status(404).json({
                message: "Catway introuvable."
            });
        }

        const reservations = await Reservation.find({
            catwayNumber: numero
        });

        return res.status(200).json(reservations);

    } catch (error) {
        console.error("Erreur réservations du catway :", error.message);

        return res.status(500).json({
            message: "Impossible de récupérer les réservations."
        });
    }
};

// =====================================
// EXPORT DU CONTRÔLEUR
// =====================================

module.exports = {
    getReservationsByCatway
};