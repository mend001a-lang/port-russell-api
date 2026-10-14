const mongoose = require("mongoose");

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
// GET : UNE RÉSERVATION D'UN CATWAY
// =====================================

const getReservationById = async (req, res) => {
    try {
        const numero = Number(req.params.id);
        const reservationId = req.params.idReservation;

        if (!Number.isInteger(numero) || numero <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide."
            });
        }

        if (!mongoose.isValidObjectId(reservationId)) {
            return res.status(400).json({
                message: "Identifiant de réservation invalide."
            });
        }

        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber: numero
        });

        if (!reservation) {
            return res.status(404).json({
                message: "Réservation introuvable pour ce catway."
            });
        }

        return res.status(200).json(reservation);

    } catch (error) {
        console.error("Erreur récupération réservation :", error.message);

        return res.status(500).json({
            message: "Impossible de récupérer la réservation."
        });
    }
};


// =====================================
// POST : CRÉER UNE RÉSERVATION
// =====================================

const createReservation = async (req, res) => {
    try {
        const numero = Number(req.params.id);
        const { clientName, boatName, startDate, endDate } = req.body;

        if (!Number.isInteger(numero) || numero <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide."
            });
        }

        if (
            typeof clientName !== "string" || !clientName.trim() ||
            typeof boatName !== "string" || !boatName.trim() ||
            !startDate || !endDate
        ) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (
            !Number.isFinite(debut.getTime()) ||
            !Number.isFinite(fin.getTime()) ||
            fin <= debut
        ) {
            return res.status(400).json({
                message: "Dates de réservation invalides."
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

        const conflit = await Reservation.findOne({
            catwayNumber: numero,
            startDate: { $lt: fin },
            endDate: { $gt: debut }
        });

        if (conflit) {
            return res.status(409).json({
                message: "Catway déjà réservé pour cette période."
            });
        }

        const reservation = await Reservation.create({
            catwayNumber: numero,
            clientName: clientName.trim(),
            boatName: boatName.trim(),
            startDate: debut,
            endDate: fin
        });

        return res.status(201).json({
            message: "Réservation créée avec succès.",
            reservation
        });

    } catch (error) {
        console.error("Erreur création réservation :", error.message);

        return res.status(500).json({
            message: "Impossible de créer la réservation."
        });
    }
};

// =====================================
// PUT : MODIFIER UNE RÉSERVATION
// =====================================

const updateReservation = async (req, res) => {
    try {
        const numero = Number(req.params.id);
        const { reservationId, clientName, boatName, startDate, endDate } = req.body;

        if (!Number.isInteger(numero) || numero <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide."
            });
        }

        if (!mongoose.isValidObjectId(reservationId)) {
            return res.status(400).json({
                message: "Identifiant de réservation invalide."
            });
        }

        if (
            typeof clientName !== "string" || !clientName.trim() ||
            typeof boatName !== "string" || !boatName.trim() ||
            !startDate || !endDate
        ) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (
            !Number.isFinite(debut.getTime()) ||
            !Number.isFinite(fin.getTime()) ||
            fin <= debut
        ) {
            return res.status(400).json({
                message: "Dates de réservation invalides."
            });
        }

        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber: numero
        });

        if (!reservation) {
            return res.status(404).json({
                message: "Réservation introuvable pour ce catway."
            });
        }

        const conflit = await Reservation.findOne({
            _id: { $ne: reservationId },
            catwayNumber: numero,
            startDate: { $lt: fin },
            endDate: { $gt: debut }
        });

        if (conflit) {
            return res.status(409).json({
                message: "Ce catway est déjà réservé pour cette période."
            });
        }

        reservation.clientName = clientName.trim();
        reservation.boatName = boatName.trim();
        reservation.startDate = debut;
        reservation.endDate = fin;

        await reservation.save();

        return res.status(200).json({
            message: "Réservation modifiée avec succès.",
            reservation
        });

    } catch (error) {
        console.error("Erreur modification réservation :", error.message);

        return res.status(500).json({
            message: "Impossible de modifier la réservation."
        });
    }
};

// =====================================
// EXPORT DU CONTRÔLEUR
// =====================================


// =====================================
// EXPORT DU CONTRÔLEUR
// =====================================

module.exports = {
    getReservationsByCatway,
    getReservationById,
    createReservation,
    updateReservation
};