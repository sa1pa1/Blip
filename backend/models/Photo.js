const pool = require("../config/database");

class Photo {
  // Upload a photo
  static async create(photoData) {
    const {
      recipeId,
      userId,
      photoUrl,
      caption,
      createdAt,
    } = photoData;

    const query = `
      INSERT INTO photos (recipe_id, user_id, photo_url, caption, created_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP))
      RETURNING *
    `;
    
    const values = [
      recipeId,
      userId,
      photoUrl,
      caption || null,
      createdAt || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get photos by recipe ID
  static async findByRecipeId(recipeId) {
    const query = `
      SELECT * FROM photos
      WHERE recipe_id = $1
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [recipeId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get photo by ID
  static async findById(photoId) {
    const query = `
      SELECT p.*, r.recipe_title, u.username
      FROM photos p
      LEFT JOIN recipes r ON p.recipe_id = r.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;

    try {
      const result = await pool.query(query, [photoId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete photo
  static async delete(photoId, userId) {
    const query = `
      DELETE FROM photos 
      WHERE id = $1 AND user_id = $2 
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [photoId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update photo caption
  static async updateCaption(photoId, userId, caption) {
    const query = `
      UPDATE photos 
      SET caption = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [caption, photoId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Photo;