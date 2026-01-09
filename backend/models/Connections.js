const pool = require("../config/database");

class Connection {
  //send friend request
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

  //Accept friend request and create bidirectional connection
  static async acceptRequest(connectionId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      //1. Get pending contacts detail
      const getRequestQuery = `
            SELECT * FROM connections
            WHERE id = $1 AND status = $2
            `;

      const getRequestResult = await client.query(getRequestQuery, [
        connectionId,
        "pending",
      ]);

      if (getRequestResult.rows.length === 0) {
        throw new Error("No pending connection found with the given ID");
      }
      const connection = getRequestResultquery.rows[0];

      //2. Update original connection to accepted
      const updateRequestQuery = `
            UPDATE connections
            SET status = 'accepted', 
            WHERE id = $1
            RETURNING *`;

      await client.query(updateRequestQuery, [connectionId]);

      //3. Create reverse connection (so both users are connected
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

  //check if connection exists between two users
  static async checkConnection(userId, connectedUserId) {
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

  //get all friends
  static async getFriends(userId) {
    const query = `
        SELECT c.*, u.username, u.full_name, u.profile_photo_url
        FROM connections c
        JOIN users u ON c.connected_user_id = u.id
        WHERE c.user_id = $1 AND c.status = 'accepted'
        ORDER BY created_at DESC
        `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // find user 
  

  //get pending requests
  static async getPendingRequests(userId) {
    const query = `
        SELECT c.*, u.username, u.email, u.full_name
        FROM connections c 
        JOIN USERS u on c.usr_id = u.id
        WHERE c.conencted_user_id = $1 AND c.status = 'pending'
        ORDER BY c.created_at DESC
        `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
