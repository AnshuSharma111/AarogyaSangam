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
            content = "Hello, you already have an appointment with " + doctor.name + " at " + appointment.timeSlot + "."; // Create the message content
        }
        else {
            content = "Hello, you already have an appointment with " + doctor.name + " at " + appointment.timeSlot + ". Please reply with 1 to confirm or 2 to cancel."; // Create the message content
        }

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code 1: User is not registered
    else if (errorCode == 1) {
        console.log("Sending SMS informing user of not being registered..."); // Log the message

        const content = "Hello, you are not registered with us. Please reply with 0 to register."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code 2: User has no appointment but is trying to cancel
    else if (errorCode == 2) {
        console.log("Sending SMS informing user that they have no appointment booked..."); // Log the message

        const content = "Hello, you have no appointment booked with us."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
    // Error Code 3: No available doctors
    else if (errorCode == 3) {
        console.log("Sending SMS informing user of no available doctors..."); // Log the message

        const content = "We regret to inform you that we are booked for the day. Please try again tomorrow."; // Create the message content

        // Emit event to send confirmation SMS
        smsEvents.emit("sendSMS", { content, to: user });
    }
};

module.exports = { errorHandler };