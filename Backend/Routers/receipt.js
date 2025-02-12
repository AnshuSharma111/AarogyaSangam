const express = require('express');

const router = express.Router();

// get receipt api controller
const receiptController = require('../Services/receipt');

// set up routes
router.route('/login')
    .post(receiptController.login);

router.route('/generate')
    .post(receiptController.checkMedicineAvailability);

router.route('/verify')
    .post(receiptController.verifyOTP);

// export router
module.exports = router;