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
// EXPORT DES ROUTES
// =====================================

module.exports = router;