
const pool = require('../config/database');

class User {
    // Create a new user
    static async create(email, passwordHash, username, fullName) {
      const query = `
        INSERT INTO users (email, password_hash, username, full_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, username, full_name, created_at
      `;
      const values = [email, passwordHash, username, fullName];
      
      try {
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    }

    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        
        try {
          const result = await pool.query(query, [email]);
          return result.rows[0];
        } catch (error) {
          throw error;
        }
      }

}

module.exports = User;