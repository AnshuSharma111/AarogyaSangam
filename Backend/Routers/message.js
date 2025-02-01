const express = require('express');

const router = express.Router();

// get medicine api controller
const messageController = require('../Controllers/message');

// set up routes
router.route('/send').post(messageController.send);
router.route('/receive').post(messageController.receive);

// export router
module.exports = router;