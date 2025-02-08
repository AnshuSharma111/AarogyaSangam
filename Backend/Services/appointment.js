const Patient = require('../Models/patient').Patient; // Import patient model
const Doctor = require('../Models/doctor').Doctor; // Import doctor model
const Appointment = require('../Models/appointment').Appointment; // Import appointment model
const smsEvents = require('../eventBus'); // Import event bus

const register = async (data) => {
    try {
        const { from } = data; // Phone number SMS received from and it's content

        // Check if user already exists in database
        const user = await Patient.findOne({ phoneno: from });
        if (user) {
            console.log(`User ${from} already has an impending appointment`);
            smsEvents.emit("error", { errorCode: 0, user: from }); // Emit error if anything goes wrong

            return;
        }

        console.log("Registering to database..."); // log

        const newPatient = new Patient({ phoneno: from }); // Create a new patient and save it to the databse with status unconfirmed
        await newPatient.save();

        console.log("Patient registered successfully"); // log

        smsEvents.emit("book", { from: from }); // Emit patientRegistered event
    } catch (error) {
        console.log(`An error occurred: ${error}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error event
    }
};

const book = async (data) => {
    try {
        const { from } = data;

        // Check whether the patient has been regsitered or not
        const user = await Patient.findOne({ phoneno: from });
        if (!user) {
            console.log(`User ${from} not registered.`);
            smsEvents.emit("error", { errorCode: 1, user: from }); // Emit error if anything goes wrong
            return;
        }

        console.log('Finding Doctor...');

        // Get the doctor with the earliest available empty slot
        const doctor = await Doctor.findOne({ availableSlots: { $ne: [] } }).sort({ "availableSlots.0": 1 });
    
        if (!doctor) {
            console.log("No available doctors");
            smsEvents.emit("error", { errorCode: 2, user: from }); // Emit error if anything goes wrong
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
        // Assign appointment id to patient
        user.appointmentno = newAppointment._id;
        await user.save();

        console.log(`Appointment booked for ${from} with Dr. ${doctor.name} at ${assignedSlot}`);

        const content = "Hello, you have an appointment with " + doctor.name + " at " + assignedSlot + ". Please reply with 1 to confirm or 2 to cancel."; // Create the message content
        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: from });
    }
    catch (error) {
        console.log(`An error occurred: ${error}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error
    }
};

const confirm = async (data) => {
    try {
        const { from } = data; // Extract Data

        // Find the user and check if they have an appointment
        const user = await Patient.findOne({ phoneno: from });

        if (!user) { // Return if user is not registered
            console.log(`User ${from} not registered.`);
            smsEvents.emit("error", { errorCode: 1, user: from }); // Emit error if anything goes wrong
            return;
        }

        // Get the associated appointment with the patient
        const appointment = await Appointment.findOne({ patientId: user._id });
        if (appointment.status == "confirmed") { // Return if user already has confirmed the appointment
            console.log(`User ${from} already has an appointment.`);
            smsEvents.emit("error", { errorCode: 0, user: from }); // Emit error if anything goes wrong
            return;
        }

        // Find the appointment and update the status to confirmed
        console.log("Updating appointment status...");

        appointment.status = "confirmed";
        await appointment.save();

        // Get associated doctor and time slot
        const doctor = await Doctor.findOne({ _id: appointment.doctorId });
        const timeSlot = appointment.timeSlot;

        // Send SMS to the patient that appointment has been confirmed
        const content = "Hello, your appointment with Dr. " + doctor.name + " at " + timeSlot + " has been confirmed."; // Create the message content
        // Send the confirmation SMS
        smsEvents.emit("sendSMS", { content, to: from });
    }
    catch (err) {
        console.log(`An error occurred: ${err}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error
    }
};

const errorHandler = async (data) => {
    const { errorCode, user } = data; // Extract error code from the request. Code, Phone Number

    console.log("Handling Error...");
    // Error Code : -1, Internal Server Error
    if (errorCode == -1) {
        console.log("Sending SMS informing user of internal server error..."); // Log the message

        const content = "We are unable to book an appointment right now. Please try again later."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code : 0, User already has an appointment but is trying to book another one
    else if (errorCode == 0) {
        console.log("Sending SMS informing user of previous appointment..."); // Log the message

        const patient = await Patient.findOne({ phoneno: user }); // Find the patient
        const appointment = await Appointment.findOne({ patientId: patient._id }); // Find the appointment
        const doctor = await Doctor.findOne({ _id: appointment.doctorId }); // Find the doctor associated with the appointment

        let content = ""; // Initialize content variable
        if (appointment.status == "confirmed") { 
            content = "Hello, you already have an appointment with Dr. " + doctor.name + " at " + appointment.timeSlot + "."; // Create the message content
        }
        else {
            content = "Hello, you already have an appointment with Dr. " + doctor.name + " at " + appointment.timeSlot + ". Please reply with 1 to confirm or 2 to cancel."; // Create the message content
        }

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code 1: User is not registered but is trying to book an appointment
    else if (errorCode == 1) {
        console.log("Sending SMS informing user of not being registered..."); // Log the message

        const content = "Hello, you are not registered with us. Please reply with 0 to register."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code 2: No available doctors
    else if (errorCode == 2) {
        console.log("Sending SMS informing user of no available doctors..."); // Log the message

        const content = "We regret to inform you that we are booked for the day. Please try again tomorrow."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
}
module.exports = { register, book, confirm, errorHandler }; // Export register and book functions