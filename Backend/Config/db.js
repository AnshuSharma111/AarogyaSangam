const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.DB_URI;

const connectDB = () => {
  return mongoose.connect(DB_URI);
};

module.exports = connectDB;