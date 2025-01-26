const { ObjectId } = require('bson');
const medicine = require('../schemas');

const getOneMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const med = await medicine.findById(id);
        if (!med) {
            return res.status(404).json({ success: false, message: "No Medicine Found!"});
        }
        return res.status(200).json({ success: true, data: med });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getAllMedicine = async (req, res) => {
    try {
        const meds = await medicine.find();
        return res.status(200).json({ success: true, data: meds });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const addMedicine = async (req, res) => {
    const { name, quantity, batchno, expiry } = req.body;
    if (!name || !quantity || !batchno || !expiry) {
        return res.status(400).json({ success: false, message: "Invalid Details!" });
    }
    try {
        id = new ObjectId();
        const newMedicine = new medicine({ _id: id, _name: name, _quantity: quantity, _batchno: batchno, _expiry: expiry });
        await newMedicine.save();
        return res.status(201).json({ success: true, message: "Medicine Added!", id: id });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteMedicine = async (req, res) => {
    const { id } = req.body;
    try {
        const med = await medicine.findByIdAndDelete(id);
        if (!med) {
            return res.status(404).json({ success: false, message: "No Medicine Found!" });
        }
        return res.status(200).json({ success: true, message: "Medicine Deleted!" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateMedicine = (req, res) => {
    const { id, name, quantity, batchno, expiry } = req.body;
    if (!name || !quantity || !batchno || !expiry) {
        return res.status(400).json({ success: false, message: "Invalid Details!" });
    }
    try {
        const med = medicine.findByIdAndUpdate(id, { _name: name, _quantity: quantity, _batchno: batchno, _expiry: expiry });
        if (!med) {
            return res.status(404).json({ success: false, message: "No Medicine Found!" });
        }
        return res.status(200).json({ success: true, message: "Medicine Updated!" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getOneMedicine, getAllMedicine, addMedicine, deleteMedicine, updateMedicine };