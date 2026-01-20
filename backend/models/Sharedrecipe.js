const pool = require("../config/database");

class SharedRecipe {
  // Share a recipe with a friend
  static async create(shareData) {
    const {
      recipeId,
      sharedBy,
      sharedWith,
      sharedAt,
    } = shareData;

    const query = `
      INSERT INTO shared_recipes (recipe_id, shared_by, shared_with, shared_at)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP))
      RETURNING *
    `;
    
    const values = [
      recipeId,
      sharedBy,
      sharedWith,
      sharedAt || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get recipes shared WITH a user (recipes others shared with them)
  static async getRecipesSharedWithUser(userId) {
    const query = `
      SELECT 
        sr.*,
        r.recipe_title,
        r.full_name as recipe_full_name,
        r.profile as recipe_profile,
        sharer.username as shared_by_username,
        sharer.first_name as shared_by_first_name,
        sharer.last_name as shared_by_last_name
      FROM shared_recipes sr
      LEFT JOIN recipes r ON sr.recipe_id = r.id
      LEFT JOIN users sharer ON sr.shared_by = sharer.id
      WHERE sr.shared_with = $1
      ORDER BY sr.shared_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get recipes shared BY a user (recipes they shared with others)
  static async getRecipesSharedByUser(userId) {
    const query = `
      SELECT 
        sr.*,
        r.recipe_title,
        r.full_name as recipe_full_name,
        r.profile as recipe_profile,
        recipient.username as shared_with_username,
        recipient.first_name as shared_with_first_name,
        recipient.last_name as shared_with_last_name
      FROM shared_recipes sr
      LEFT JOIN recipes r ON sr.recipe_id = r.id
      LEFT JOIN users recipient ON sr.shared_with = recipient.id
      WHERE sr.shared_by = $1
      ORDER BY sr.shared_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if recipe is already shared between two users
  static async findSharedRecipe(recipeId, sharedBy, sharedWith) {
    const query = `
      SELECT * FROM shared_recipes
      WHERE recipe_id = $1 AND shared_by = $2 AND shared_with = $3
    `;
    
    try {
      const result = await pool.query(query, [recipeId, sharedBy, sharedWith]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete shared recipe
  static async delete(sharedRecipeId, userId) {
    const query = `
      DELETE FROM shared_recipes 
      WHERE id = $1 AND shared_by = $2 
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [sharedRecipeId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SharedRecipe;