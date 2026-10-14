const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const verifierConnexion = require("../middlewares/verifierConnexion");

// =====================================
// GET : RÉSERVATIONS D'UN CATWAY
// =====================================

router.get(
    "/catways/:id/reservations",
    verifierConnexion,
    reservationController.getReservationsByCatway
);

// =====================================
// GET : UNE RÉSERVATION D'UN CATWAY
// =====================================

router.get(
    "/catway/:id/reservations/:idReservation",
    verifierConnexion,
    reservationController.getReservationById
);

// =====================================
// EXPORT DES ROUTES
// =====================================

module.exports = router;