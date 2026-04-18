const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const projectRoutes = require('./routes/projectRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Middleware
app.use(express.json());

// Routes
app.use('/api', projectRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Project Management API is running');
});

// Database Connection and Server Start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

module.exports = app; // For testing