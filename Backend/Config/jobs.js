const cron = require("node-cron");
const { Doctor } = require("../Models/doctor");
const { Appointment } = require("../Models/appointment");
const { Patient } = require("../Models/patient");
const nodemailer = require("nodemailer");

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // App password
  }
});

// Standard doctor working slots (9AM-12PM, 2PM-5PM)
const defaultSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"];

// CRON job to reset doctor availability at 5 PM daily
cron.schedule("0 17 * * *", async () => {
  try {
    console.log("Resetting doctor schedules for the next day...");
    await Doctor.updateMany({}, { availableSlots: defaultSlots });
    console.log("Doctor schedules reset successfully!");

  } catch (error) {
    console.error("Error in emailing schedules and resetting data:", error);
  }
});

module.exports = cron;