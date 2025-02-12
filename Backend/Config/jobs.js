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

// Helper function to get the date for the day after tomorrow
const getDayAfterTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2); // Move forward by 2 days
  date.setHours(0, 0, 0, 0); // Normalize time
  return date;
};

// CRON job scheduled at 5 PM every day
cron.schedule("0 17 * * *" , async () => {
  try {
    console.log("Sending appointment schedules to doctors...");

    const appointmentDate = getDayAfterTomorrow();

    // Fetch confirmed appointments for the day after tomorrow
    const confirmedAppointments = await Appointment.find({ status: "confirmed" })
      .populate("doctorId", "name email")
      .populate("patientId", "phoneno");

    if (confirmedAppointments.length === 0) {
      console.log("No confirmed appointments to send.");
    } else {
      // Group appointments by doctor
      const doctorSchedules = {};

      confirmedAppointments.forEach(appt => {
        const doctorId = appt.doctorId._id;
        if (!doctorSchedules[doctorId]) {
          doctorSchedules[doctorId] = {
            doctor: appt.doctorId,
            appointments: []
          };
        }
        doctorSchedules[doctorId].appointments.push({
          patient: appt.patientId.phoneno,
          timeSlot: appt.timeSlot
        });
      });

      // Send email to each doctor
      for (const doctorId in doctorSchedules) {
        const { doctor, appointments } = doctorSchedules[doctorId];

        const appointmentList = appointments.map(appt =>
          `📌 Patient: ${appt.patient} | Time: ${appt.timeSlot}`
        ).join("\n");

        const emailBody = `
          Hello Dr. ${doctor.name},\n\n
          Here is your confirmed schedule for ${appointmentDate.toDateString()}:\n
          ${appointmentList}\n\n
          Best Regards,
          Your Clinic
        `;

        // Send email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: doctor.email,
          subject: "📅 Your Appointment Schedule for the Day After Tomorrow",
          text: emailBody
        });

        console.log(`Sent schedule to Dr. ${doctor.name} (${doctor.email})`);
      }
    }

    // Reset doctor availability for the next day
    console.log("Resetting doctor schedules for the next day...");
    await Doctor.updateMany({}, { availableSlots: defaultSlots });
    console.log("Doctor schedules reset successfully!");

    // Clean the appointment table (delete past appointments)
    console.log("Cleaning past appointments...");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    await Appointment.deleteMany({ date: { $lte: yesterday } });
    console.log("Old appointments deleted!");

    console.log("All tasks completed successfully!");

  } catch (error) {
    console.error("Error in emailing schedules and resetting data:", error);
  }
});

module.exports = cron;