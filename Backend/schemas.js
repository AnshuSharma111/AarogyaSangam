const { Int32 } = require('bson');
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  _name: { type: String, required: true },
  _quantity: { type: Int32, required: true },
  _batchno: {type: String, required: true },
  _expiry: {type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  _phoneno: { type: String, required: true }
})

const Medicine = mongoose.model('medicine', medicineSchema);
const User = mongoose.model('user', userSchema);

module.exports = { Medicine, User };