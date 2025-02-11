const { mongoose } = require('mongoose');
const Medicine = require('../Models/medicine').Medicine;

// GET Single Medicine
const getOneMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID!" });
        }
        const med = await Medicine.findById(id);
        if (!med) {
            return res.status(404).json({ success: false, message: `No Medicine with id: ${id} found` });
        }
        return res.status(200).json({ success: true, data: med });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET All Medicines
const getAllMedicine = async (req, res) => {
    try {
        const meds = await Medicine.find();
        return res.status(200).json({ success: true, data: meds });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST New Medicine
const addMedicine = async (req, res) => {
    try {
        const { name, quantity, batchno, expiry } = req.body;
        if (!name || !quantity || !batchno || !expiry) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }
        const newMedicine = new Medicine({ name, quantity, batchno, expiry });
        await newMedicine.save();

        // Broadcast inventory update
        req.broadcastInventoryUpdate();

        return res.status(201).json({ success: true, message: "Medicine Added!", id: newMedicine._id });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE Medicine
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID!" });
        }
        const med = await Medicine.findByIdAndDelete(id);
        if (!med) {
            return res.status(404).json({ success: false, message: `No Medicine with id: ${id} found` });
        }

        // Broadcast inventory update
        req.broadcastInventoryUpdate();

        return res.status(200).json({ success: true, message: "Medicine Deleted!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Update Medicine
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID!" });
        }
        const updatedMed = await Medicine.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedMed) {
            return res.status(404).json({ success: false, message: "No Medicine Found!" });
        }

        // Broadcast inventory update
        req.broadcastInventoryUpdate();

        return res.status(200).json({ success: true, message: "Medicine Updated!", data: updatedMed });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getOneMedicine, getAllMedicine, addMedicine, deleteMedicine, updateMedicine };
