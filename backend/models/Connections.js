const pool = require("../config/database");

class Connection {
  // Send friend request
  static async friendRequest(senderId, newConnection) {
    const query = `
        INSERT INTO connections (user_id, connected_user_id, status)
        VALUES ($1, $2, 'pending')
        RETURNING *
        `;

    const values = [senderId, newConnection];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Accept friend request and create bidirectional connection
  static async acceptRequest(connectionId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get pending connection details
      const getRequestQuery = `
            SELECT * FROM connections
            WHERE id = $1 AND status = 'pending'
            `;

      const getRequestResult = await client.query(getRequestQuery, [
        connectionId,
      ]);

      if (getRequestResult.rows.length === 0) {
        throw new Error("No pending connection found with the given ID");
      }
      const connection = getRequestResult.rows[0];

      // 2. Update original connection to accepted
      const updateRequestQuery = `
            UPDATE connections
            SET status = 'accepted'
            WHERE id = $1
            RETURNING *`;

      await client.query(updateRequestQuery, [connectionId]);

      // 3. Create reverse connection (so both users are connected)
      const BidirectionalConnectionQuery = `
            INSERT INTO connections (user_id, connected_user_id, status)
            VALUES ($1, $2, 'accepted')
            ON CONFLICT DO NOTHING
            RETURNING *`;

      await client.query(BidirectionalConnectionQuery, [
        connection.connected_user_id,
        connection.user_id,
      ]);

      await client.query("COMMIT");
      return connection;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Reject friend request
  static async rejectFriend(connectionId) {
    const query = `
    DELETE FROM connections
    WHERE id = $1 AND status = 'pending'
    RETURNING *
    `;

    try {
      const result = await pool.query(query, [connectionId]);

      if (result.rows.length === 0) {
        throw new Error("No pending connection with the given ID");
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if connection exists between two users
  static async findConnection(userId, connectedUserId) {
    const query = `
        SELECT * FROM connections 
        WHERE (user_id = $1 AND connected_user_id = $2)
        OR (user_id = $2 AND connected_user_id = $1)
        `;

    try {
      const result = await pool.query(query, [userId, connectedUserId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all friends
  static async getFriends(userId) {
    const query = `
        SELECT c.*, u.username, u.full_name, u.profile_photo_url
        FROM connections c
        JOIN users u ON c.connected_user_id = u.id
        WHERE c.user_id = $1 AND c.status = 'accepted'
        ORDER BY c.created_at DESC
        `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get pending requests
  static async getPendingRequests(userId) {
    const query = `
        SELECT c.*, u.username, u.email, u.full_name
        FROM connections c 
        JOIN users u ON c.user_id = u.id
        WHERE c.connected_user_id = $1 AND c.status = 'pending'
        ORDER BY c.created_at DESC
        `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete friend connection (bidirectional)
  static async deleteFriend(connectionId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get the connection details
      const getQuery = "SELECT * FROM connections WHERE id = $1";
      const getResult = await client.query(getQuery, [connectionId]);

      if (getResult.rows.length === 0) {
        throw new Error("Connection not found");
      }

      const connection = getResult.rows[0];

      // 2. Delete the original connection
      await client.query("DELETE FROM connections WHERE id = $1", [
        connectionId,
      ]);

      // 3. Delete the reverse connection
      const reverseDeleteQuery = `
        DELETE FROM connections 
        WHERE user_id = $1 AND connected_user_id = $2
      `;
      await client.query(reverseDeleteQuery, [
        connection.connected_user_id,
        connection.user_id,
      ]);

      await client.query("COMMIT");
      return connection;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Connection;
