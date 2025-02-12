const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  availableSlots: [{ type: String }], // Example: ["09:00-10:00", "10:00-11:00"]
  email: { type: String, required: true }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = { Doctor };