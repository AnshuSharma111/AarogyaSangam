const express = require('express');
const medicineRouter = require('./Routers/medicine');
const smsRouter = require('./Routers/sms');
const receiptRouter = require("./Routers/receipt");
const appointmentRouter = require('./Routers/appointment');
const connectDB = require('./Config/db');
const cors = require('cors');
require('dotenv').config();
require("./Config/jobs");
require("./Listeners/smsListener");

const PORT = process.env.PORT || 5000;
const app = express();

// error handler for middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/medicine', medicineRouter); // Router for all medicine API calls
app.use('/api/sms', smsRouter); // Router for SMS API calls
app.use('/api/receipt', receiptRouter); // Router for receipt API calls
app.use('/api/appointment', appointmentRouter); // Router for appointment API calls
app.use(errorHandler);

// test route
app.get("/", (req, res) => {
    res.send("<h1>Aarogya Sangam is up and running</h1>");
});

// Non-existent route handler
app.all("*", (req, res) => {
    res.status(404).send("<h1>Page Not Found 404</h1>");
});

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (error) {
        console.log("Error starting server: ", error);
    }
};

start();