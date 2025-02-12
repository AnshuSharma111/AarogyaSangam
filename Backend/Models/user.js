const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    username : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    shopid : { type: mongoose.Schema.Types.ObjectId },
    complaints : { type: Array, default: [] },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = { Vendor };