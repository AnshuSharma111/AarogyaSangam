const express = require('express');

const router = express.Router();

// get medicine api controller
const appointmentController = require('../Controllers/appointment');

// set up routes
router.route('/')
    .get(appointmentController.getAllAppointments);

// export router
module.exports = router;