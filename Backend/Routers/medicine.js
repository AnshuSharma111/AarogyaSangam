const express = require('express');
const router = express.Router();
const medicineController = require('../Controllers/medicine');

router.route('/:id')
  .get(medicineController.getOneMedicine)
  .delete(async (req, res) => {
    try {
      await medicineController.deleteMedicine(req, res);
      if (res.statusCode === 200) {
        await req.broadcastInventoryUpdate();
      }
    } catch (error) {
      console.error('Error in delete route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  })
  .patch(async (req, res) => {
    try {
      await medicineController.updateMedicine(req, res);
      if (res.statusCode === 200) {
        await req.broadcastInventoryUpdate();
      }
    } catch (error) {
      console.error('Error in update route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

router.route('/')
  .get(medicineController.getAllMedicine)
  .post(async (req, res) => {
    try {
      await medicineController.addMedicine(req, res);
      if (res.statusCode === 200) {
        await req.broadcastInventoryUpdate();
      }
    } catch (error) {
      console.error('Error in post route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;