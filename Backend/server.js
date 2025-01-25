const express = require('express');

const PORT = 5000;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
})