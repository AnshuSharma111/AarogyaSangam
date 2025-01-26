const { Int32, ObjectId } = require('bson');
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true, unique: true },
  _name: { type: String, required: true },
  _quantity: { type: Int32, required: true },
  _batchno: {type: String, required: true },
  _expiry: {type: Date, required: true },
});

const medicine = mongoose.model('User', medicineSchema);

module.exports = medicine;
