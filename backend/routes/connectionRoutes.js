const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

// Send friend request
router.post('/', connectionController.friendRequest);

// Accept friend request
router.put('/:connectionId/accept', connectionController.acceptRequest);

// Get all friends
router.get('/friends/:userId', connectionController.getFriends);

// Get pending requests
router.get('/pending/:userId', connectionController.getPendingRequests);

modules.exports = router;