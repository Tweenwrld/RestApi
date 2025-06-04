// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const { port } = require('./config/config');

const app = express();

// Middleware
app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use('/api/products', productRoutes); 

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.use('/api/products', productRoutes);

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});