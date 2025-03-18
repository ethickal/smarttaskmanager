// server/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();

// Import routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Smart Task Manager API is running...');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});