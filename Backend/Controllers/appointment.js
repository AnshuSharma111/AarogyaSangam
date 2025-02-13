const { Appointment } = require("../Models/appointment");

const getAllAppointments = async (req, res) => {
    try {
        console.log("Fetching all appointments...");

        const appointments = await Appointment.find().populate("patientId", "name").populate("doctorId", "name");

        console.log("Appointments fetched successfully");
        console.log(appointments);

        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error(`Error fetching appointments: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { getAllAppointments };
