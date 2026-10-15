const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const verifierConnexion = require("../middlewares/verifierConnexion");

// =====================================
// GET : LISTE DES RÉSERVATIONS
// =====================================

router.get(
    "/catways/:id/reservations",
    verifierConnexion,
    reservationController.getReservationsByCatway
);

// =====================================
// GET : DÉTAIL D'UNE RÉSERVATION
// =====================================

router.get(
    "/catway/:id/reservations/:idReservation",
    verifierConnexion,
    reservationController.getReservationById
);

// =====================================
// POST : CRÉER UNE RÉSERVATION
// =====================================

router.post(
    "/catways/:id/reservations",
    verifierConnexion,
    reservationController.createReservation
);

// =====================================
// PUT : MODIFIER UNE RÉSERVATION
// =====================================

router.put(
    "/catways/:id/reservations",
    verifierConnexion,
    reservationController.updateReservation
);

// =====================================
// DELETE : SUPPRIMER UNE RÉSERVATION
// =====================================

router.delete(
    "/catway/:id/reservations/:idReservation",
    verifierConnexion,
    reservationController.deleteReservation
);

// =====================================
// EXPORT DES ROUTES
// =====================================

module.exports = router;