const express = require('express');
const medicineRouter = require('./Routers/medicine');
const messageRouter = require('./Routers/message');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

// Connecct to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/medicine', medicineRouter); // Router for all medicine API calls
app.use('/api/message', messageRouter); // Router for all message API calls

// Non Existant Routes
app.all('*', (req, res) => {
    res.status(404).send('<h1>Page Not Found 404</h1>');
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})