const pool = require("../config/database");

class Recipe {
  // Create a new recipe (BE/US 1)
  static async create(recipeData) {
    const {
      userId,
      recipeTitle,
      fullName,
      profile,
      createdAt,
      updatedAt,
    } = recipeData;

    const query = `
      INSERT INTO recipes (user_id, recipe_title, full_name, profile, created_at, updated_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP), COALESCE($6, CURRENT_TIMESTAMP))
      RETURNING *
    `;
    
    const values = [
      userId,
      recipeTitle,
      fullName || null,
      profile || null,
      createdAt || null,
      updatedAt || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a recipe
  static async update(recipeId, userId, recipeData) {
    const {
      recipeTitle,
      fullName,
      profile,
    } = recipeData;

    const query = `
      UPDATE recipes 
      SET recipe_title = COALESCE($1, recipe_title),
          full_name = COALESCE($2, full_name),
          profile = COALESCE($3, profile),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        recipeTitle,
        fullName,
        profile,
        recipeId,
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get recipes by user ID
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM recipes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Find recipe by ID with user details
  static async findById(recipeId) {
    const query = `
      SELECT r.*, u.username, u.first_name, u.last_name, u.profile_photo_url
      FROM recipes r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;

    try {
      const result = await pool.query(query, [recipeId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a recipe
  static async delete(recipeId, userId) {
    const query = `
      DELETE FROM recipes 
      WHERE id = $1 AND user_id = $2 
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [recipeId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Recipe;