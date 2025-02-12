const smsEvents = require("../eventBus"); // Import shared event emitter
const appointmentController = require("../Services/appointment"); // Import appointment controller
const smsController = require("../Services/sms"); // Import sms controller
const errorHandler = require("../Config/errors"); // Import error handler

// Listem for events
smsEvents.on("register", appointmentController.register); // register patient event
smsEvents.on("book", appointmentController.book); // book appointment event
smsEvents.on("confirm", appointmentController.confirm); // confirm appointment event
smsEvents.on("cancel", appointmentController.cancel); // cancel appointment event
smsEvents.on("sendSMS", smsController.send); // send SMS event

smsEvents.on("error", errorHandler.errorHandler); // error event