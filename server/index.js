const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users'); // 👈 FIXED: previously './routes/users'

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Error: Missing environment variables');
  process.exit(1);
}

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', userRoutes); // 👈 FIXED: Mount your auth routes here

// Default Route
app.get('/', (req, res) => {
  res.send('Smart Task Manager API is running...');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
