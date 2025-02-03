const { mongoose } = require('mongoose');
const Medicine = require('../Models/medicine').Medicine;

// GET endpoint
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET endpoint
const getAllMedicine = async (req, res) => {
    try {
        const meds = await Medicine.find();
        return res.status(200).json({ success: true, data: meds });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST endpoint
const addMedicine = async (req, res) => {
    try {
        const { name, quantity, batchno, expiry } = req.body;
        if (!name || !quantity || !batchno || !expiry) {
            return res.status(400).json({ success: false, message: "Invalid Details!" });
        }
        const newMedicine = new  Medicine({ name: name, quantity: quantity, batchno: batchno, expiry: expiry });
        await newMedicine.save();
        return res.status(201).json({ success: true, message: "Medicine Added!", id: newMedicine._id });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE endpoint
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
        return res.status(200).json({ success: true, message: "Medicine Deleted!" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH endpoint
const updateMedicine = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, batchno, expiry } = req.body;
    if (!name || !quantity || !batchno || !expiry) {
        return res.status(400).json({ success: false, message: "Invalid Details!" });
    }
    try {
        const med = await Medicine.findByIdAndUpdate(id , { name: name, quantity: quantity, batchno: batchno, expiry: expiry });
        if (!med) {
            return res.status(404).json({ success: false, message: "No Medicine Found!" });
        }
        return res.status(200).json({ success: true, message: "Medicine Updated!" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// exxport all functions
module.exports = { getOneMedicine, getAllMedicine, addMedicine, deleteMedicine, updateMedicine };