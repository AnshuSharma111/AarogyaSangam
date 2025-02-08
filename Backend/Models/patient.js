const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    phoneno : { type: Number, required: [true, 'phoneno is a required field'], trim: true },
    status : { type: String, default: "unconfirmed" },
});

const Patient = mongoose.model('patient', patientSchema);

module.exports = { Patient };