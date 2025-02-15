const express = require('express');

const router = express.Router();

// get medicine api controller
const smsController = require('../Services/sms');

// set up routes
router.post('/receive', smsController.receive);

// export router
module.exports = router;