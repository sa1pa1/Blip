require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework -> API server
const cors = require('cors'); // Import CORS middleware for React frontend
const pool = require('./config/database');

//Routes
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 


//Middleware
app.use(cors());
app.use(express.json());

// API test route
app.get('/', (req, res) => {
  res.json({ message: 'Blip API is running!' });
});

// Database test route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connected!', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// User Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});