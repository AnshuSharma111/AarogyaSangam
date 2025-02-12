const express = require('express');
const http = require('http');
const winston = require('winston');
const WebSocket = require('ws');
const connectDB = require('./Config/db');
const medicineRouter = require('./Routers/medicine');
const smsRouter = require('./Routers/sms');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Vendor: User } = require('./Models/user'); 
const secretKey = process.env.JWT_SECRET;
require('dotenv').config();
require("./Config/jobs");
require("./Listeners/smsListener");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "server.log" })
    ]
});

// WebSocket Server Setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// Function to Broadcast Inventory Updates
const broadcastInventoryUpdate = async () => {
    try {
        const Medicine = require('./Models/medicine').Medicine;
        const medicines = await Medicine.find();
        const payload = JSON.stringify({ type: 'inventory_update', data: medicines });

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    } catch (error) {
        console.error('Error broadcasting inventory update:', error);
    }
};

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Attach WebSocket Broadcast Function to Request
app.use((req, res, next) => {
    req.broadcastInventoryUpdate = broadcastInventoryUpdate;
    next();
});

// ✅ Fix: Ensure WebSocket Updates on Inventory Change
app.post('/api/update-inventory', async (req, res) => {
    await broadcastInventoryUpdate();
    res.status(200).json({ message: "Inventory updated" });
});

// Default Route for `/`
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory Management API');
});

app.post('/api/receipt/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Directly compare passwords (⚠️ Not recommended for production)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Use Routers
app.use('/api/medicine', medicineRouter);
app.use('/api/sms', smsRouter);

// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
};
app.use(errorHandler);

// Start the Server
const start = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}...`);
        });
    } catch (error) {
        logger.error("Error starting server: ", error);
    }
};

start();
