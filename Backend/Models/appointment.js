const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, default: "unconfirmed" }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = { Appointment };