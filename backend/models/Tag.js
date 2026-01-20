const pool = require("../config/database");

class Tag {
  // Create or get existing tag
  static async findOrCreate(tagName) {
    // Normalize tag name (lowercase, trim)
    const normalizedTag = tagName.toLowerCase().trim();

    try {
      // First, try to find existing tag
      const findQuery = `
        SELECT * FROM tags 
        WHERE tag_name = $1
      `;
      const findResult = await pool.query(findQuery, [normalizedTag]);

      if (findResult.rows.length > 0) {
        return findResult.rows[0];
      }

      // If not found, create it
      const createQuery = `
        INSERT INTO tags (tag_name)
        VALUES ($1)
        RETURNING *
      `;
      const createResult = await pool.query(createQuery, [normalizedTag]);
      return createResult.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all tags
  static async getAllTags() {
    const query = `
      SELECT t.*, COUNT(pt.post_id) as usage_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY usage_count DESC, t.tag_name ASC
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Search tags by name
  static async searchTags(searchTerm) {
    const query = `
      SELECT t.*, COUNT(pt.post_id) as usage_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      WHERE t.tag_name ILIKE $1
      GROUP BY t.id
      ORDER BY usage_count DESC, t.tag_name ASC
      LIMIT 20
    `;

    try {
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get trending tags (most used recently)
  static async getTrendingTags(limit = 10) {
    const query = `
      SELECT t.*, COUNT(pt.post_id) as usage_count
      FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      INNER JOIN posts p ON pt.post_id = p.id
      WHERE p.created_at > NOW() - INTERVAL '7 days'
      GROUP BY t.id
      ORDER BY usage_count DESC
      LIMIT $1
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tag;