const Patient = require('../Models/patient').Patient; // Import patient model
const Doctor = require('../Models/doctor').Doctor; // Import doctor model
const Appointment = require('../Models/appointment').Appointment; // Import appointment model
const smsEvents = require('../eventBus'); // Import event bus

const register = async (data) => {
    try {
        const { from, content } = data; // Phone number SMS received from and it's content

        console.log("Registering to database..."); // log

        const newPatient = new Patient({ phoneno: from }); // Create a new patient and save it to the databse with status unconfirmed
        await newPatient.save();

        console.log("Patient registered successfully"); // log

        smsEvents.emit("patientRegistered", { from: from }); // Emit patientRegistered event
    } catch (error) {
        console.log(`An error occured: ${error}`); // log error

        smsEvents.emit("Error", { error: error }); // Emit error event
    }
};

const book = async (data) => {
    try {
        const { from } = data;

        // Check whether the patient has been regsitered or not
        const user = await Patient.findOne({ phoneno: from });
        if (!user) {
            console.log(`User ${from} not registered.`);
            smsEvents.emit("Error", { error: `User ${from} not registered.` }); // Emit error if anything goes wrong
            return;
        }

        console.log('Finding Doctor...');

        // Get the doctor with the earliest available empty slot
        const doctor = await Doctor.findOne({ availableSlots: { $ne: [] } }).sort({ "availableSlots.0": 1 });
    
        if (!doctor) {
            console.log("No available doctors");
            smsEvents.emit("Error", { error: "No available doctors" }); // Emit error if anything goes wrong
            return;
        }
      
        // Assign the first available slot
        console.log('Found Doctor, assigning slot...');
        const assignedSlot = doctor.availableSlots.shift();
        // Update doctor in DB
        await doctor.save();

        // Save the appointment in DB
        const newAppointment = await Appointment.create({
            patientId: user._id,
            doctorId: doctor._id,
            timeSlot: assignedSlot
        });

        console.log(`Appointment booked for ${from} with Dr. ${doctor.name} at ${assignedSlot}`);

        const content = "Hello, you have an appointment with " + doctor.name + " at " + assignedSlot + ". Please reply with 1 to confirm or 2 to cancel."; // Create the message content
        // Emit event to send confirmation SMS
        smsEvents.emit("appointmentBooked", { content, to: from });
    }
    catch (error) {
        console.log(`An error occured: ${error}`); // log error
    }
};

module.exports = { register, book }; // Export register and book functions