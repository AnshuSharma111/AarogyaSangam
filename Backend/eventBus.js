const EventEmitter = require("events");
const smsEvents = new EventEmitter(); // Create a universal event emitter

module.exports = smsEvents; // Export shared event emitter