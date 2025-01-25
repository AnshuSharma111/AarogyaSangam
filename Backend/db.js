const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;