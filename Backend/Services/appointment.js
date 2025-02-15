const Patient = require('../Models/patient').Patient; // Import patient model
const Doctor = require('../Models/doctor').Doctor; // Import doctor model
const Appointment = require('../Models/appointment').Appointment; // Import appointment model
const smsEvents = require('../eventBus'); // Import event bus
const { generateResponse } = require("./genai.mjs"); // Import function to prompt model
require("./genai.mjs"); // Import Model

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
            smsEvents.emit("error", { errorCode: 3, user: from }); // Emit error if anything goes wrong
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

        console.log(`Appointment booked for ${from} with ${doctor.name} at ${assignedSlot}`);

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
        const content = "Hello, your appointment with " + doctor.name + " at " + timeSlot + " has been confirmed."; // Create the message content
        // Send the confirmation SMS
        smsEvents.emit("sendSMS", { content, to: from });
    }
    catch (err) {
        console.log(`An error occurred: ${err}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error
    }
};

const cancel = async (data) => {
    try {
        const { from } = data; // Extract Data

        // Find Appointment linked to the phoneno
        const patient = await Patient.findOne({ phoneno: from });
        if (!patient) { // Return if user is not registered
            console.log(`User ${from} not registered.`);
            smsEvents.emit("error", { errorCode: 1, user: from }); // Emit error if anything goes wrong
            return;
        }
        const appointment = await Appointment.findOne({ patientId: patient._id });
        if (!appointment) { // Return if user is not registered
            console.log(`No appointment for user ${from}.`);
            smsEvents.emit("error", { errorCode: 2, user: from }); // Emit error if anything goes wrong
            return;
        }

        // Get the associated appointed time slot and re-add it to the associated doctor's schedule
        console.log("Getting booked time slot...");

        const doctor = await Doctor.findOne({ _id: appointment.doctorId });
        doctor.availableSlots.push(appointment.timeSlot);
        await doctor.save();

        console.log("Added time slot back to doctor's schedule...");

        // Delete the appointment and user
        console.log("Deleting appointment and user...");

        let response = await Appointment.deleteOne({ patientId: patient._id });
        if (response.deletedCount == 0) { // Check if the appointment was deleted
            console.log("Could not delete appointment.");
            smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error if anything goes wrong
            return;
        }
        console.log("Deleted appointment successfully.");
        response = await Patient.deleteOne({ _id: patient._id });
        if (response.deletedCount == 0) { // Check if the appointment was deleted
            console.log("Could not delete patient.");
            smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error if anything goes wrong
            return;
        }
        console.log("Deleted patient successfully.");

        // Send SMS to the patient that appointment has been cancelled
        const content = "Hello, your appointment has been cancelled."; // Create the message content
        smsEvents.emit("sendSMS", { content, to: from }); // Send the confirmation SMS
    }
    catch (error) {
        console.log(`An error occurred: ${error}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // Emit error
    }
}

// Handle unknown SMS
const guide = async (data) => {
    try {
        const { content, from } = data;

        console.log("Handling unknown SMS...");

        if (!content || !from) {
            console.log("No content or from!");
            smsEvents.emit("error", { errorCode: -1, user: from }); // SET LATER
        }

        console.log("Generating response to unknown SMS...");

        const prompt = "You are a chatbot that provides guidance to users trying to use an application booking system. The user needs to press 0 to book appointment, 1 to confirm appointment and 2 to cancel it. The user has sent content " + content + ". Guide them accordingly.";

        const response = await generateResponse(prompt);

        if (!response) {
            console.log("Could not generate response!");
            smsEvents.emit("error", { errorCode: -1, user: from }); // SET LATER
        }

        console.log("Generated response " + response);

        smsEvents.emit("sendSMS", { content: response, to: from });
    } catch (error) {
        console.log(`An error occurred: ${error}`); // log error
        smsEvents.emit("error", { errorCode: -1, user: from }); // SET LATER
    }
}
module.exports = { register, book, confirm, cancel, guide }; // Export register and book functions
