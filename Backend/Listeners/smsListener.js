const smsEvents = require("../eventBus"); // Import shared event emitter
const appointmentController = require("../Services/appointment"); // Import appointment controller
const smsController = require("../Services/sms"); // Import sms controller

smsEvents.on("register", appointmentController.register); // Listen for register event and call register function
smsEvents.on("book", appointmentController.book); // Listen for book event and call book function
smsEvents.on("confirm", appointmentController.confirm); // Listen for confirm event and call confirm function
smsEvents.on("sendSMS", smsController.send); // Listen for appointmentBooked event and call confirm function
smsEvents.on("error", appointmentController.errorHandler); // Listen for error event and call errorHandler function