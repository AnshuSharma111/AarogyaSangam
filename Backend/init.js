const mongoose = require("mongoose");
const { Doctor } = require("./Models/doctor");
require("dotenv").config();

mongoose.connect(process.env.DB_URI);

const doctors = [
  { name: "Dr. Raj", availableSlots: ["09:00-10:00", "10:00-11:00", "11:00-12:00"], email: "amanna1041@gmail.com" },
  { name: "Dr. Paul", availableSlots: ["09:00-10:00", "10:00-11:00", "11:00-12:00"], email: "contact@amitrajeetkonch.me" }
];

const seedDoctors = async () => {
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log("✅ Doctors populated!");
  mongoose.connection.close();
};

seedDoctors();
