const Appointment = require('../Models/appointment');

const getAllAppointments = async (req, res) => {
    try {
        console.log("Trying to get all appointments");

        const appointments = await Appointment.find();

        console.log("Appointments fetched successfully");
        return res.status(200).json({ success: true, data: appointments });
    }
    catch (error) {
        console.log(`An error occurred: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { getAllAppointments };