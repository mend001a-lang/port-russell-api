const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    catwayNumber: Number,
    clientName: String,
    boatName: String,
    startDate: String,
    endDate: String
});

const Reservation = mongoose.model("Reservation", reservationSchema, "reservations");
module.exports = Reservation;