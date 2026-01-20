const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// Get all tags
router.get("/", tagController.getAllTags);

// Search tags
router.get("/search", tagController.searchTags);

// Get trending tags
router.get("/trending", tagController.getTrendingTags);

// Get posts by tag name
router.get("/:tagName/posts", tagController.getPostsByTag);

module.exports = router;