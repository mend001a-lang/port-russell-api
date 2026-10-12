const mongoose = require("mongoose");
const catwaySchema = new mongoose.Schema({
    catwayNumber: Number,
    catwayType: String,
    catwayState: String
});
const Catway = mongoose.model("Catway", catwaySchema, "catways");

module.exports = Catway;