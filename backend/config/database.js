const { Pool } = require('pg'); // Import pg Pool for PostgreSQL connection 
// pg lets Node.js applications interact with PostgreSQL databases
// Excecute SQL queries and manage database connections

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error connecting', err);
  process.exit(-1);
});

// Test pool query function
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection test failed:', err);
  } else {
    console.log('Database connection test successful');
  }
});

module.exports = pool;