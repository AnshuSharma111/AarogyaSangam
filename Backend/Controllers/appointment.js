const Appointment = require("../Models/appointment");

const getAllAppointments = async (req, res) => {
    try {
        console.log("Fetching all appointments...");

        const appointments = await Appointment.find()
            .populate("patientId", "name phoneno") // Fetch patient details
            .populate("doctorId", "name") // Fetch doctor details
            .select("patientId doctorId timeSlot status"); // Select only necessary fields

        console.log("Appointments fetched successfully");
        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error(`Error fetching appointments: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { getAllAppointments };
