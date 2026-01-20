const pool = require("../config/database");

class PostTag {
  // Add tag to post
  static async addTagToPost(postId, tagId) {
    const query = `
      INSERT INTO post_tags (post_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, tag_id) DO NOTHING
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [postId, tagId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Remove tag from post
  static async removeTagFromPost(postId, tagId) {
    const query = `
      DELETE FROM post_tags
      WHERE post_id = $1 AND tag_id = $2
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [postId, tagId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all tags for a post
  static async getTagsForPost(postId) {
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = $1
      ORDER BY t.tag_name ASC
    `;

    try {
      const result = await pool.query(query, [postId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts with a specific tag
  static async getPostsByTag(tagId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_photo_url as user_profile_photo,
        r.recipe_title,
        r.full_name as recipe_full_name
      FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN recipes r ON p.recipe_id = r.id
      WHERE pt.tag_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await pool.query(query, [tagId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts with a specific tag name
  static async getPostsByTagName(tagName, limit = 50, offset = 0) {
    const normalizedTag = tagName.toLowerCase().trim();
    
    const query = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_photo_url as user_profile_photo,
        r.recipe_title,
        r.full_name as recipe_full_name
      FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN recipes r ON p.recipe_id = r.id
      WHERE t.tag_name = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await pool.query(query, [normalizedTag, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Remove all tags from a post
  static async removeAllTagsFromPost(postId) {
    const query = `
      DELETE FROM post_tags
      WHERE post_id = $1
    `;

    try {
      await pool.query(query, [postId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostTag;