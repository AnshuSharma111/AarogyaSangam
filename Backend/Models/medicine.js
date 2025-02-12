const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true },
  batchno: { type: String, required: true },
  expiry: { type: Date, required: true }
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = { Medicine };