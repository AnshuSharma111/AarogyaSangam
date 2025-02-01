const { ObjectId } = require('bson');
const medicine = require('../schemas').Medicine;

// GET endpoint
const getOneMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = ObjectId.createFromHexString(id);
        const med = await medicine.findById(objId);
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
        const meds = await medicine.find();
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
        id = new ObjectId();
        const newMedicine = new medicine({ _id: id, _name: name, _quantity: quantity, _batchno: batchno, _expiry: expiry });
        await newMedicine.save();
        return res.status(201).json({ success: true, message: "Medicine Added!", id: id });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE endpoint
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const objId = ObjectId.createFromHexString(id);
        const med = await medicine.findByIdAndDelete(objId);
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
    const objId = ObjectId.createFromHexString(id);
    const { name, quantity, batchno, expiry } = req.body;
    if (!name || !quantity || !batchno || !expiry) {
        return res.status(400).json({ success: false, message: "Invalid Details!" });
    }
    try {
        const med = await medicine.findByIdAndUpdate(objId, { _name: name, _quantity: quantity, _batchno: batchno, _expiry: expiry });
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