const express = require('express');
const winston = require('winston');
const medicineRouter = require('./Routers/medicine');
const smsRouter = require('./Routers/sms');
const connectDB = require('./Config/db');
const cors = require('cors');
require('dotenv').config();
require("./Config/jobs");
require("./Listeners/smsListener");

const PORT = process.env.PORT || 5000;
const app = express();

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "server.log" })
    ]
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/api/medicine', medicineRouter); // Router for all medicine API calls

// error handler for middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
};

app.use(errorHandler);
app.use('/api/sms', smsRouter); // Router for SMS API calls

// test route
app.get("/", (req, res) => {
    res.json({ message: "Aarogya Sangam is up and running" });
});

// Non-existent route handler
app.all("*", (req, res) => {
    res.status(404).send("<h1>Page Not Found 404</h1>");
});

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}...`);
        });
    } catch (error) {
        logger.error("Error starting server: ", error);
    }
};

start();