const Connection = require("../models/Connections");

// SEND FRIEND REQUEST
exports.friendRequest = async (req, res) => {
  const { userId, newConnectionId } = req.body;

  try {
    if (!userId || !newConnectionId) {
      return res
        .status(400)
        .json({ message: "User ID and new connection ID are required" });
    }

    const existingConnection = await Connection.findConnection(
      userId,
      newConnectionId
    );
    if (existingConnection) {
      return res.status(409).json({
        message:
          "Connection request already exists or users are already connected",
      });
    }

    const connection = await Connection.friendRequest(userId, newConnectionId);
    res.status(201).json({
      message: "Friend request sent successfully",
      connection,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ACCEPT FRIEND REQUEST
exports.acceptRequest = async (req, res) => {
  const { connectionId } = req.params;

  try {
    if (!connectionId) {
      return res.status(400).json({ message: "Connection ID is required" });
    }

    const connection = await Connection.acceptRequest(connectionId);

    res.status(200).json({
      message: "Friend request accepted successfully. Bidirectional connection created.",
      connection,
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL FRIENDS
exports.getFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await Connection.getFriends(userId);

    res.status(200).json({
      message: "Friends retrieved successfully",
      count: friends.length,
      friends,
    });
  } catch (error) {
    console.error("Error retrieving friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET PENDING REQUESTS
exports.getPendingRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const pendingRequests = await Connection.getPendingRequests(userId);

    res.status(200).json({
      message: "Pending requests retrieved successfully",
      count: pendingRequests.length,
      pendingRequests,
    });
  } catch (error) {
    console.error("Error retrieving pending requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
