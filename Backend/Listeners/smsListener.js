const { Sms } = require("twilio/lib/twiml/VoiceResponse");
const smsEvents = require("../eventBus"); // Import shared event emitter
const appointmentController = require("../Services/appointment"); // Import appointment controller
const smsController = require("../Services/sms"); // Import sms controller

smsEvents.on("book", appointmentController.register); // Listen for smsReceived event and call register function
smsEvents.on("patientRegistered", appointmentController.book); // Listen for patientRegistered event and call book function
smsEvents.on("appointmentBooked", smsController.send); // Listen for appointmentBooked event and call confirm function