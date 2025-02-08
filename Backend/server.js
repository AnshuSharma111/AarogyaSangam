const express = require('express');
const medicineRouter = require('./Routers/medicine');
const smsRouter = require('./Routers/sms');
const connectDB = require('./Config/db');
const cors = require('cors');
require('dotenv').config();
require("./Config/jobs");
require("./Listeners/smsListener");

const PORT = process.env.PORT || 5000;
const app = express();

// error handler for middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use('/api/medicine', medicineRouter); // Router for all medicine API calls
app.use('/api/sms', smsRouter); // Router for SMS API calls

app.get('/', (req, res) => {
    res.send('<h1>Healthcare API</h1>');
});

// Non Existant Routes
app.all('*', (req, res) => {
    res.status(404).send('<h1>Page Not Found 404</h1>');
})

const start = async () => {
    try {
        // Try to connect to the database
        await connectDB();
        // Start the server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is listening on port ${PORT}...`);
        });
    } catch (error) {
        console.error(error);
    }
}

// Start the server
start()