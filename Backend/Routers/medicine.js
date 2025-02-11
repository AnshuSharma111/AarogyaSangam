const express = require('express');
const router = express.Router();
const medicineController = require('../Controllers/medicine');

router.route('/:id')
    .get(medicineController.getOneMedicine)
    .delete(async (req, res, next) => {
        await medicineController.deleteMedicine(req, res, next);
        req.broadcastInventoryUpdate(); // Trigger WebSocket update
    })
    .patch(async (req, res, next) => {
        await medicineController.updateMedicine(req, res, next);
        req.broadcastInventoryUpdate(); // Trigger WebSocket update
    });

router.route('/')
    .get(medicineController.getAllMedicine)
    .post(async (req, res, next) => {
        await medicineController.addMedicine(req, res, next);
        req.broadcastInventoryUpdate(); // Trigger WebSocket update
    });

module.exports = router;
