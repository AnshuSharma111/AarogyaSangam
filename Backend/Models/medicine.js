const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is a required field'], trim: true },
  quantity: { type: Number, required: [true, 'quantity is a required field'] },
  batchno: {type: String, required: [true, 'batchno is a required field'] },
  expiry: {type: Date, required: [true, 'expiry date is a required field'] },
});

const Medicine = mongoose.model('medicine', medicineSchema);

module.exports = { Medicine };