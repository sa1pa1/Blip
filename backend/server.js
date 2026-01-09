require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework -> API server
const cors = require('cors'); // Import CORS middleware for React frontend
const pool = require('./config/database');

//ROUTES
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const connectionRoutes = require('./routes/connectionRoutes');

//Express app setup
const app = express();
const PORT = process.env.PORT || 3000; 


//MIDDLEWARE
app.use(cors());
app.use(express.json());

//API TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'Blip API is running!' });
});

//DATABASE TEST ROUTE
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

//API ROUTES
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/connections', connectionRoutes);

//START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});