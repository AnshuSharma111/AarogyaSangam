const getOneMedicine = (req, res) => {
    res.send("Here is the medicine detail");
};

const getAllMedicine = (req, res) => {
    res.send("Here are all the medicine");
};

const addMedicine = (req, res) => {
    res.send("Medicine created successfully");
};

const deleteMedicine = (req, res) => {
    res.send("Deleted Medicine!");
};

const updateMedicine = (req, res) => {
    res.send('Updated Medicine!');
};

module.exports = { getOneMedicine, getAllMedicine, addMedicine, deleteMedicine, updateMedicine };