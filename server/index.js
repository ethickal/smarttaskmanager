const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users'); // Routes for authentication

// Ensure the necessary environment variables are present
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Error: Missing environment variables');
  process.exit(1);
}

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL for CORS
  credentials: true,               // Allow cookies to be sent with requests
}));
app.use(express.json()); // To parse incoming JSON payloads

// API routes
app.use('/api/tasks', taskRoutes); // Handle tasks-related routes
app.use('/api/auth', userRoutes);  // Handle user authentication routes

// Default route for testing server status
app.get('/', (req, res) => {
  res.send('Smart Task Manager API is running...');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the server console
  res.status(500).json({ msg: 'Something went wrong!', error: err.message }); // Send error response
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
