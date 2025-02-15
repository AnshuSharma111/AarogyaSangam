const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const connectDB = require('./Config/db');
const medicineRouter = require('./Routers/medicine');
const smsRouter = require('./Routers/sms');
const receiptRouter = require('./Routers/receipt');
const appointmentRouter = require('./Routers/appointment');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Vendor:User } = require('./Models/vendor');
const secretKey = process.env.JWT_SECRET;
require('dotenv').config();
require("./Config/jobs");
require("./Listeners/smsListener");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// Logger setup
const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "server.log" })
    ]
});

// Socket.IO setup
const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend URL
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });
  
  // Track connected clients
  let connectedClients = new Set();
  
  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    connectedClients.add(socket.id);
    console.log('Total connected clients:', connectedClients.size);
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
      console.log('Total connected clients:', connectedClients.size);
    });
  });
  
  // Updated broadcast function
  const broadcastInventoryUpdate = async () => {
    try {
      const Medicine = require('./Models/medicine').Medicine;
      const medicines = await Medicine.find().sort({ name: 1 });
      console.log('Broadcasting to', connectedClients.size, 'clients');
      io.emit('inventory_update', medicines);
      return true;
    } catch (error) {
      console.error('Broadcast error:', error);
      return false;
    }
  };
  
  // Middleware to attach broadcast function
  app.use((req, res, next) => {
    req.broadcastInventoryUpdate = broadcastInventoryUpdate;
    next();
});

// Middleware
app.use(cors({ 
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.use(express.json());


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Inventory Management API');
});

app.post('/api/receipt/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            secretKey, 
            { expiresIn: "5m" }
        );
        
        res.json({ token, message: "Login successful" });
    } catch (error) {
        logger.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Router middleware
app.use('/api/medicine', medicineRouter);
app.use('/api/sms', smsRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/appointment', appointmentRouter);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
};
app.use(errorHandler);

// Server startup
const start = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info('Socket.IO server initialized');
        });
    } catch (error) {
        logger.error("Error starting server:", error);
        process.exit(1);
    }
};

start();