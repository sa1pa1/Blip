const pool = require("../config/database");

class Post {
  // Create a new post (BE/US 3)
  static async create(postData) {
    const {
      userId,
      recipeId,
      profilePhotoUrl,
      caption,
      createdAt,
    } = postData;

    const query = `
      INSERT INTO posts (user_id, recipe_id, profile_photo_url, caption, created_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP))
      RETURNING *
    `;
    
    const values = [
      userId,
      recipeId,
      profilePhotoUrl || null,
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

  // Get post by ID with recipe, user details, and tags
  static async findById(postId) {
    const query = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_photo_url as user_profile_photo,
        r.recipe_title,
        r.full_name as recipe_full_name,
        r.profile as recipe_profile,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'tag_name', t.tag_name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN recipes r ON p.recipe_id = r.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id, u.id, r.id
    `;

    try {
      const result = await pool.query(query, [postId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all posts by user ID
  static async findByUserId(userId) {
    const query = `
      SELECT 
        p.*,
        r.recipe_title,
        r.full_name as recipe_full_name,
        r.profile as recipe_profile
      FROM posts p
      LEFT JOIN recipes r ON p.recipe_id = r.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all posts (feed) with tags
  static async getAllPosts(limit = 50, offset = 0) {
    const query = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_photo_url as user_profile_photo,
        r.recipe_title,
        r.full_name as recipe_full_name,
        r.profile as recipe_profile,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'tag_name', t.tag_name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN recipes r ON p.recipe_id = r.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id, u.id, r.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    try {
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update post
  static async update(postId, userId, postData) {
    const { caption, profilePhotoUrl } = postData;

    const query = `
      UPDATE posts 
      SET caption = COALESCE($1, caption),
          profile_photo_url = COALESCE($2, profile_photo_url)
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        caption,
        profilePhotoUrl,
        postId,
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  static async delete(postId, userId) {
    const query = `
      DELETE FROM posts 
      WHERE id = $1 AND user_id = $2 
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [postId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;