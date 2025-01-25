const express = require('express');
const apiRouter = require('./Routers/apiRouter');

const PORT = 5000;
const app = express();

// Middleware
app.use(express.json());
app.use('/api/medicine', apiRouter); // Router for all API calls

// Non Existant Routes
app.all('*', (req, res) => {
    res.status(404).send('<h1>Page Not Found 404</h1>');
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
})