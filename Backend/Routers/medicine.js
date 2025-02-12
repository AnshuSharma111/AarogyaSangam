const express = require('express');

const router = express.Router();

// get medicine api controller
const medicineController = require('../Controllers/medicine');

// set up routes
router.route('/:id')
.get(medicineController.getOneMedicine)
.delete(medicineController.deleteMedicine)
.patch(medicineController.updateMedicine);

router.route('/')
.get(medicineController.getAllMedicine)
.post(medicineController.addMedicine)

// export router
module.exports = router;