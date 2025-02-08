require('dotenv').config();
const smsEvents = require('../eventBus');

// POST method for sending message
const send = async (data) => {
    try {
        const { content, to } = data; // Extract data from the request
        const from = process.env.SEND_PHONE_NUMBER; // Extract the sender number from the environment variables
        console.log("Sending SMS to " + to + " with content: " + content); // Log the message

        const response = await fetch('https://api.httpsms.com/v1/messages/send', { // send SMS through httpSMS API
            method: "POST",
            headers: {
                "x-api-key": process.env.SMS_API_TOKEN,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                content: content,
                from: from,
                to: to
            })
        });

        const res = await response.json(); // Parse the response

        if (!response.ok) {
            console.log("An error occured while sending SMS!"); // Log error
        }

        console.log("Sent SMS to " + to + " from " + from + " with content: " + content); // Log the message sent
    } catch (error) {
        console.log(`An error occured while sending SMS: ${error}`); // Log error
    }
}

const receive = async (req, res) => {
    const content = req.body.data.content; // Extract the content from the request
    const from = req.body.data.contact; // Extract the sender number from the request
    console.log("SMS received from " + from + " with content: " + content); // Log the received SMS

    if (!req.body) {
        console.log("Invalid receive Request!"); // Log error

        return res.status(400).json({ success: false, message: "No Body" });
    }

    if (content == "0") { // 0 is the code to book an appointment
        console.log("Appointment booking request received"); // Log the request

        smsEvents.emit("book", { from, content }); // Emit event to book an appointment
        return res.status(200).json({ success: true, message: "Appointment booking request received" });
    }
    else if (content == "1") { // 1 is the code to confirm appointment
        console.log("Appointment confirmation received"); // Log the request

        smsEvents.emit("confirm", req.body); // Emit event to confirm an appointment
        return res.status(200).json({ success: true, message: "Appointment confirmation request received" });
    }
    else {
        console.log("Unknown SMS received"); // Log the request

        return res.status(200).json({ success: true, message: "Unknown SMS received" });
    }
}

module.exports = { send, receive };