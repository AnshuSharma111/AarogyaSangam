const express = require('express');
const router = express.Router();

// get all methods from controller folder
const apiController = require('../Controllers/apiController');

// All Routes
router.route('/:id')
.get(apiController.getOneMedicine);

router.route('/')
.get(apiController.getAllMedicine)
.post(apiController.addMedicine)
.delete(apiController.deleteMedicine)
.put(apiController.updateMedicine);

module.exports = router;