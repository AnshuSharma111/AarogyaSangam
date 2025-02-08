const cron = require("node-cron");
const { Doctor } = require("../Models/doctor");

// Define the standard working hours excluding the 1 PM - 2 PM break
const defaultSlots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"];

// CRON job to reset doctor availability at 5 PM daily
cron.schedule("0 17 * * *", async () => {
  try {
    console.log("Resetting doctor schedules for the next day...");

    // Reset all doctors' available slots
    await Doctor.updateMany({}, { availableSlots: defaultSlots });

    console.log("Doctor schedules reset successfully!");

  } catch (error) {
    console.error("Error resetting doctor schedules:", error);
  }
});

module.exports = cron;